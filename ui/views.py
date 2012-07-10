"""
Views for Indivo JS UI
"""

# todo: rm unused
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseForbidden, HttpRequest
from django.contrib.auth.models import User
from django.core.exceptions import *
from django.core.urlresolvers import reverse
from django.core import serializers
from django.db import transaction
from django.conf import settings
from django.utils import simplejson
from indivo_client_py.oauth import oauth
from django.db import transaction

from models import SmartConnectToken
import xml.etree.ElementTree as ET
import urllib, re
import httplib, urllib, urllib2, urlparse
import time
from smart_ui_server import utils

from indivo_client_py.lib.client import IndivoClient


HTTP_METHOD_GET = 'GET'
HTTP_METHOD_POST = 'POST'
LOGIN_PAGE = 'ui/login'
DEBUG = True
passthrough_server = "/smart_passthrough"

# init the IndivoClient python object
SMART_SERVER_LOCATION = urlparse.urlparse(settings.SMART_API_SERVER_BASE)
SMART_SERVER_LOCATION = {
      'host':SMART_SERVER_LOCATION.hostname,
    'scheme': SMART_SERVER_LOCATION.scheme,
      'port': SMART_SERVER_LOCATION.port
              or (
                  SMART_SERVER_LOCATION.scheme == 'http' and '80'
                  or SMART_SERVER_LOCATION.scheme == 'https' and '443'
              )
    }


def get_api(request=None):
    api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, SMART_SERVER_LOCATION)
    if request:
        api.update_token(request.session['oauth_token_set'])
    
    return api

def tokens_p(request):
    try:
        if request.session['oauth_token_set']:
            return True
        else:
            return False
    except KeyError:
        return False

def tokens_get_from_server(request, username, password):
    """This method logs the user in
    
    Return value is a tuple, first tuple value is a bool whether login succeeded, second tuple value the reason if it failed.
    """
    
    success = False
    reason = 'Username missing' if not username else 'incorrect'
    
    # create a session. This method throws an Exception when the server is down
    tmp = None
    api = get_api()
    try:
        tmp = api.create_session({'username': username, 'user_pass': password})
    except Exception, e:
        if 'Socket Error' == e.value:
            reason = "The server is currently not available. Please try again in a few minutes"
        else:
            reason = e.value;
    
    if tmp:
        success = True
        reason = ''
    elif DEBUG:
        utils.log('error: likely a bad username/password, or incorrect tokens from UI server to backend server.')
    
    request.session['username'] = username
    request.session['oauth_token_set'] = tmp
    request.session['account_id'] = urllib.unquote(tmp.get('account_id', '') if tmp else '')
    
    if tmp and DEBUG:
        utils.log('oauth_token: %(oauth_token)s outh_token_secret: %(oauth_token_secret)s' % request.session['oauth_token_set'])
    
    return (success, reason)

def proxy_index(request):
    api = get_api()
    
    record_id = request.GET['record_id']
    record_name = request.GET.get('record_name', "Proxied Patient")
    initial_app= request.GET.get('initial_app', "")
    
    api.call("POST", "/records/create/proxied", options={
       'data': {'record_id':record_id, 
                'record_name':record_name,
                }
       })
    
    options = {}
    pin= request.GET.get('pin', "")   
    if pin: 
        options['data'] = {'pin' : pin}
    
    base = "/records/%s/generate_direct_url" 
    target_url = api.call("GET", base%record_id, options=options)
    
    if initial_app != "":
        target_url += "?initial_app="+initial_app
    
    return HttpResponseRedirect(target_url)

def token_login_index(request, token):
    request.session.flush()
    api = get_api()
    
    reqstore = request.GET
    if (request.method == 'POST'):
        reqstore = request.POST
    
    initial_app = reqstore.get('initial_app', "")
    
    options = {'data': {'token':token}}
    pin = reqstore.get('pin', "")   
    if pin: 
        options['data']['pin'] = pin
    
    logintokenxml =   api.call("GET", "/session/from_direct_url", options=options)
    
    if logintokenxml.startswith("Permission Denied"):
        if "Wrong pin" in logintokenxml:
            return utils.render_template("ui/need_pin",{})
        return HttpResponse(logintokenxml)
    
    logintoken= ET.fromstring(logintokenxml) 
    record_id = logintoken.find("Record").get("id")
    record_name = logintoken.find("Record").get("label")
    
    session_tokens = dict(urlparse.parse_qsl(logintoken.get("value")))
    account_id = session_tokens['account_id']
    request.session['oauth_token_set'] = session_tokens
    request.session['account_id'] = urllib.unquote(account_id)
    
    api = get_api(request)
    account_id = urllib.unquote(request.session['oauth_token_set']['account_id'])
    ret = api.account_info(account_id = account_id)
    
    e = ET.fromstring(ret.response['response_data'])
    fullname = e.findtext('givenName') +" "+ e.findtext('familyName')
    
    target_template = "ui/proxy_index"
    
    
    credentials = "''"
    manifest = "''"
    
    if (initial_app != ""):
        target_template = "ui/single_app_view"
        credentials = single_app_get_credentials(request, api, account_id, initial_app, record_id)
        manifest = single_app_get_manifest(api, initial_app)

    return utils.render_template(target_template,
         { 
         'ACCOUNT_ID': session_tokens["account_id"],
         'FULLNAME': fullname,
         'PROXIED_RECORD_ID' : record_id,
         'PROXIED_RECORD_NAME': record_name,
         'INITIAL_APP': initial_app,
         'SMART_PASSTHROUGH_SERVER': passthrough_server ,
         'CREDENTIALS': credentials,
         'MANIFEST': manifest 
         })

def single_app_get_manifest(api, app_id):
    r =  api.call("GET", "/apps/%s/manifest"%app_id)
    return r

def single_app_get_credentials(request, api, account_id, app_id, record_id=None):
    launch_opts = {}

    if record_id:
        launch_opts['record_id'] = record_id

    launchdata = api.call("GET", 
                          "/accounts/%s/apps/%s/launch"%(account_id, app_id), 
                          options = { 'data': launch_opts })

    credentials = store_connect_secret(request, launchdata)
    return simplejson.dumps(credentials)


##
##  Login and logout
##
def mobile_login(request, info="", template='ui/mobile_login'):
    return login(request, info, template)

def login(request, info="", template=LOGIN_PAGE):
    """
    clear tokens in session, show a login form, get tokens from indivo_server, then redirect to return_url or index
    FIXME: make note that account will be disabled after 3 failed logins!!!
    """
    # generate a new session
    request.session.flush()
    
    # set up the template
    errors = {'missing': "Either the username or password is missing. Please try again.",
            'incorrect': "Incorrect username or password. Please try again.",
             'disabled': "This account has been disabled/locked."}
    
    username = None
    
    # GET, simply return the login form
    if request.method == HTTP_METHOD_GET:
        return_url = request.GET.get('return_url', '/')
        if (return_url.strip()==""):
            return_url='/'
        
        return utils.render_template(template, {'RETURN_URL': return_url})
    
    # credentials were posted, try to login
    if request.method == HTTP_METHOD_POST:
        return_url = request.POST.get('return_url', '/')
        if (return_url.strip()==""): return_url='/'
        if request.POST.has_key('username') and request.POST.has_key('password'):
            username = request.POST['username']
            password = request.POST['password']
        else:
            # Also checked initially in js
            return utils.render_template(template, {'ERROR': errors['missing'], 'RETURN_URL': return_url})
    else:
        utils.log('error: bad http request method in login. redirecting to /')
        return HttpResponseRedirect('/')
    
    # get tokens from the backend server and save in this user's django session
    ret, reason = tokens_get_from_server(request, username, password)
    
    if not ret:
        error_message = errors[reason] if errors.has_key(reason) else reason
        return utils.render_template(LOGIN_PAGE, {'ERROR': error_message, 'ACCOUNT': username, 'RETURN_URL': return_url})
    return HttpResponseRedirect(return_url)

def logout(request):
    # todo: have a "you have logged out message"
    request.session.flush()
    return HttpResponseRedirect('/login')



def showcase_index(request):
    api = get_api()
    
    initial_app= request.GET.get('initial_app', "")
    
    ret, reason = tokens_get_from_server(request, settings.PROXY_USER, settings.PROXY_PASSWORD)
    if not ret:
        return utils.render_template(LOGIN_PAGE, {'ERROR': 'Could not find proxied user'})      # or use 'reason'?
    
    return utils.render_template('ui/showcase',
          { 'ACCOUNT_ID': settings.PROXY_USER,
            'INITIAL_APP': initial_app,
            'SMART_PASSTHROUGH_SERVER': passthrough_server })


def mobile_index(request, template='ui/mobile_index'):
    return index(request,  template)

   
def index(request, template='ui/index'):
    print "INDEX", template
    
    if tokens_p(request):
        # get the realname here. we already have it in the js account model
        try:
            api = get_api(request)
            account_id = urllib.unquote(request.session['oauth_token_set']['account_id'])
            ret = api.account_info(account_id = account_id)
            e = ET.fromstring(ret.response['response_data'])
            
            fullname = e.findtext('givenName') +" "+ e.findtext('familyName')
            return utils.render_template(template,
              { 'ACCOUNT_ID': account_id,
                'FULLNAME': fullname,
                'HIDE_GET_MORE_APPS': settings.HIDE_GET_MORE_APPS,
                'SMART_PASSTHROUGH_SERVER': passthrough_server })
        except:  pass
    
    if (template == "ui/mobile_index"):
        return HttpResponseRedirect(reverse(mobile_login))
    return HttpResponseRedirect(reverse(login))

def store_connect_secret(request, launchdata):
    e = ET.fromstring(launchdata)
    
    c = {       "app_id": e.find('App').get("id"), 
         "connect_token": e.findtext('ConnectToken'), 
        "connect_secret": e.findtext('ConnectSecret'), 
              "api_base": e.findtext('APIBase'), 
            "rest_token": e.findtext('RESTToken'),  
           "rest_secret": e.findtext('RESTSecret'), 
          "oauth_header": e.findtext('OAuthHeader')
    };
    
    print request.session.session_key, c["connect_token"], c["connect_secret"]
    t = SmartConnectToken(session_key = request.session.session_key,
                  smart_connect_token = c["connect_token"],
                 smart_connect_secret = c["connect_secret"])
    
    t.save()
    del c["connect_secret"]
    return c


##
##  Apps
##
def launch_app(request, account_id, pha_email):
    if not tokens_p(request):
        return HttpResponseRedirect(reverse(login))
    
    api = get_api(request)
    
    record_id = request.GET.get('record_id', None)
    launch_opts = {}
    
    if record_id:
        launch_opts['record_id'] = record_id
    
    launchdata = api.call("GET", 
                          "/accounts/%s/apps/%s/launch"%(account_id, pha_email), 
                          options = { 'data': launch_opts })
    
    credentials = store_connect_secret(request, launchdata)
    return HttpResponse(simplejson.dumps(credentials), content_type="application/json")


def launch_rest_app(request, app_id):
    """ Entry point for any given app.
    
    If the app does not exist (or another exception occurrs), will render /ui/error with the given error message. On success, renders /ui/record_select after
    the user has logged in. Selecting a record will redirect to launch_app_complete.
    """
    
    # have the user login first
    login_url = "%s?return_url=%s" % (reverse(login), urllib.quote(request.get_full_path()))
    account_id = urllib.unquote(request.session.get('account_id', ''))
    if not account_id:
        return HttpResponseRedirect(login_url)
    
    # get the account holder's name (fail silently)
    fullname = 'Unknown'
    api = get_api(request)
    ret = api.account_info(account_id = account_id)
    status = ret.response.get('response_status', 0) if ret and ret.response else 0
    if 200 == status:
        e = ET.fromstring(ret.response['response_data'])
        fullname = "%s %s" % (e.findtext('givenName'), e.findtext('familyName'))
    
    # fetch all records
#    import pdb; pdb.set_trace()
    records = []
    try:
        record_rdf = api.call("GET", "/records/search/xml");
        print record_rdf
    except Exception, e:
        return utils.render_template('ui/error', {'ERROR_MESSAGE': "Failed to fetch records", 'ERROR_STATUS': 500})
    
    # render the template
    params = {          'SETTINGS': settings,
                          'APP_ID': app_id,
                      'ACCOUNT_ID': account_id,
        'SMART_PASSTHROUGH_SERVER': passthrough_server,
                        'FULLNAME': fullname
    }
    return utils.render_template('ui/record_select', params)


def launch_rest_app_complete(request, app_id):
    """ Prepare an app's start url for launch, and redirect to it. 
    
    If this is a POST, then enable the app first (because it was just authorized)
    """
    
    # have the user login first
    login_url = "%s?return_url=%s" % (reverse(login), urllib.quote(request.get_full_path()))
    account_id = urllib.unquote(request.session.get('account_id', ''))
    if not account_id:
        return HttpResponseRedirect(login_url)
    
    # If we were just authorized, enable the app
    if request.method == 'POST':
        record_id = request.POST.get('record_id', '')
        carenet_id = ''
        api = get_api(request)
        if record_id:
            resp, content = api.record_pha_enable(record_id=record_id, pha_email=app_id)
            status = resp['status']
            if status != '200':
                error_message = ErrorStr("Error enabling the app")
                return utils.render_template('ui/error', {'ERROR_MESSAGE': error_message, 'ERROR_STATUS': status})
    
    if request.method == 'GET':
        record_id = request.GET.get('record_id', '')
        carenet_id = request.GET.get('carenet_id', '')
    
    params_dict = {'record_id':record_id, 'carenet_id':carenet_id}
    
    # logged in, get information about the desired app
    api = get_api(request)
    resp, content = api.pha(pha_email=app_id)
    status = resp['status']
    error_message = None
    if '404' == status:
        error_message = ErrorStr('No such App').str()
    elif '200' != status:
        error_message = ErrorStr(content or 'Error getting app info').str()
    
    # success, find start URL template
    else:
        app_info_json = content or ''
        app_info = simplejson.loads(app_info_json)
        if not app_info:
            error_message = ErrorStr('Error getting app info')
        else:
            start_url = app_info.get('index')    
            start_url = _interpolate_url_template(app_info.get('index'), params_dict)
    
    if not start_url:
        error_message = ErrorStr('Error getting app info: no start URL')
    
    # get SMART credentials for the request
    api = get_api(request)
    resp, content = api.get_connect_credentials(account_email=account_id, pha_email=app_id, body=params_dict)
    status = resp['status']
    if status == '403':
        if carenet_id:
            error_message = ErrorStr("This app is not enabled to be run in the selected carenet.")
        elif record_id:
            return utils.render_template('ui/authorize_record_launch_app',
                                         {'CALLBACK_URL': '/apps/%s/complete/'%app_id,
                                          'RECORD_ID': record_id,
                                          'TITLE': _('Authorize "{{name}}"?').replace('{{name}}', app_info['name'])
})
    elif status != '200':
        error_message = ErrorStr("Error getting account credentials")
    else:
        oauth_header = etree.XML(content).findtext("OAuthHeader")
        
    if not oauth_header:
        error_message = ErrorStr("Error getting account credentials")
    
    if error_message is not None:
        return utils.render_template('ui/error', {'ERROR_MESSAGE': error_message, 'ERROR_STATUS': status})
    
    # append the credentials and redirect
    querystring_sep = '&' if '?' in start_url else '?'
    start_url += querystring_sep + "oauth_header=" + oauth_header
    return HttpResponseRedirect(start_url)


def smart_passthrough(request):
    if not tokens_p(request):
        return HttpResponseForbidden()
    
    relative_path =  request.get_full_path().replace(passthrough_server, "")
    full_path = api_server() + relative_path
    
    query_string = request.META['QUERY_STRING']
    body = request.raw_post_data
    data = query_string or body
    
    content_type = request.META['CONTENT_TYPE']
    method = request.method
    http_request = oauth.HTTPRequest(method=method, path=full_path, data=data, data_content_type=content_type)
    
    c = oauth.parse_header(request.META['HTTP_AUTHORIZATION'])
    token_str =  c['smart_connect_token']
    t = SmartConnectToken.objects.get(session_key=request.session.session_key, smart_connect_token = token_str)
    secret = t.smart_connect_secret
    
    token = oauth.OAuthToken(token = token_str, secret =secret)
    consumer = oauth.OAuthConsumer(consumer_key = settings.CONSUMER_KEY, secret = settings.CONSUMER_SECRET)
    oauth_request = oauth.OAuthRequest(consumer, token, http_request)
    oauth_request.sign()
    
    headers = oauth_request.to_header(with_content_type=True)
    api = api_server(include_scheme=False)
    
    if request.is_secure():
        conn = httplib.HTTPSConnection(api)
    else:
        conn = httplib.HTTPConnection(api)
    
    conn.request(request.method, full_path.split(api)[1], body, headers)
    r = conn.getresponse()    
    data = r.read()
    conn.close()
    
    ret = HttpResponse(data, 
                     content_type=r.getheader("Content-type"), 
                     status=r.status)
    
    ret['Expires'] = "Sun, 19 Nov 1978 05:00:00 GMT"
    ret['Last-Modified'] =  time.ctime()
    ret['Cache-Control'] = "store, no-cache, must-revalidate, post-check=0, pre-check=0" 
    return ret

def api_server(include_scheme = True):
    loc = SMART_SERVER_LOCATION
    port = loc['port']
    scheme=loc['scheme']
    host = loc['host']
    
    port_matches = (scheme=='http' and port=='80') or (scheme=='https'  and port=='443')
    
    if (port_matches):
        ret = host
    else:
        ret =  "%s:%s"%(host, port )
    
    if (include_scheme):
        return "%s://%s"%(scheme, ret)
    return ret


##
##  Account handling
##
def account_initialization(request):
    """
    http://localhost/indivoapi/accounts/foo@bar.com/initialize/icmloNHxQrnCQKNn
    """
    errors = {'generic': 'There was a problem setting up your account. Please try again.'}
    api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, SMART_SERVER_LOCATION)
    
    if request.method == HTTP_METHOD_GET:
        return utils.render_template('ui/account_init', {})
    
    if request.method == HTTP_METHOD_POST:
        # a 404 returned from this call could indicate that the account doesn't exist! Awesome REST logic!
        account_id = request.path_info.split('/')[3]
        ret = api.account_initialize(account_id = account_id,
                                 primary_secret = request.path_info.split('/')[5],
                                           data = {'secondary_secret':request.POST['conf1'] + request.POST['conf2']})
        
        if ret.response['response_status'] == 200:
            return utils.render_template('ui/account_init_2', {'FULLNAME': ''})
        else:
            return utils.render_template('ui/account_init', {'ERROR': errors['generic']})

def account_initialization_2(request):
    if request.method == HTTP_METHOD_POST:
        account_id = request.path_info.split('/')[3]
        username = request.POST['username']
        password = request.POST['pw1']
        errors = {'generic': 'There was a problem updating your data. Please try again. If you are unable to set up your account please contact support.'}
        api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, SMART_SERVER_LOCATION)
        ret = api.add_auth_system(account_id = account_id,
                                        data = {'system':'password',
                                              'username': username,
                                              'password': password})
        
        if ret.response['response_status'] == 200:
            # everything's OK, log this person in, hard redirect to change location
            tokens_get_from_server(request, username, password)
            return HttpResponseRedirect('/')
        else:
            return utils.render_template('ui/account_init_2', {'ERROR': errors['generic']})
    
    return utils.render_template('ui/account_init_2', {})

def indivo_api_call_get(request):
    """
    take the call, forward it to the Indivo server with oAuth signature using
    the session-stored oAuth tokens
    """
    if DEBUG:
        utils.log('indivo_api_call_get: ' + request.path)
    
    if not tokens_p(request):
        utils.log('indivo_api_call_get: No oauth_token or oauth_token_secret.. sending to login')
        return HttpResponseRedirect('/login')
    
    # update the IndivoClient object with the tokens stored in the django session
    api = get_api(request)
    
    # strip the leading /indivoapi, do API call, and return result
    if request.method == "POST":
        data = dict((k,v) for k,v in request.POST.iteritems())
    elif request.method == "GET":
        data = dict((k,v) for k,v in request.GET.iteritems())
    else:
        data = {}
    ret = HttpResponse(api.call(request.method, request.path[10:], options= {'data': data}), mimetype="application/xml")
    return ret

def indivo_api_call_delete_record_app(request):
    """
    sort of like above but for app delete
    """
    if request.method != HTTP_METHOD_POST:
        return HttpResponseRedirect('/')
    
    if DEBUG:
        utils.log('indivo_api_call_delete_record_app: ' + request.path + ' ' + request.POST['app_id'] + ' ' + request.POST['record_id'])
    
    if not tokens_p(request):
        utils.log('indivo_api_call_delete_record_app: No oauth_token or oauth_token_secret.. sending to login')
        return HttpResponseRedirect('/login')
    
    # update the IndivoClient object with the tokens stored in the django session
    api = get_api(request)
    
    # get the app id from the post, and return to main
    status = api.delete_record_app(record_id=request.POST['record_id'],app_id=request.POST['app_id']).response['response_status']
    
    return HttpResponse(str(status))

def authorize(request):
    # check user is logged in
    if not tokens_p(request):
        url = "%s?return_url=%s" % (reverse(login), urllib.quote(request.get_full_path()))
        return HttpResponseRedirect(url)
    
    api = get_api(request)
    
    # read the app info
    REQUEST_TOKEN = request.REQUEST['oauth_token']
    
    # process GETs (initial adding and a normal call for this app)
    if request.method == HTTP_METHOD_GET and request.GET.has_key('oauth_token'):
        # claim request token and check return value
        if api.claim_request_token(request_token=REQUEST_TOKEN).response['response_status'] != 200:
            return HttpResponse('bad response to claim_request_token')
        
        # get app and record info
        app_info = api.get_request_token_info(request_token=REQUEST_TOKEN).response['response_data']
        e = ET.fromstring(app_info)
        
        record_id = e.find('record').attrib.get('id', None)
        name = e.findtext('App/name')
        app_id = e.find('App').attrib['id']
        kind = e.findtext('kind')
        description = e.findtext('App/description')
        
        offline_capable = (e.findtext('DataUsageAgreement/offline') == "1")
        
        # the "kind" param lets us know if this is app setup or a normal call
        if kind == 'new':     
            return utils.render_template('ui/authorize',
                                        {'NAME': name,
                                  'DESCRIPTION': description,
                                'REQUEST_TOKEN': REQUEST_TOKEN,
                              'OFFLINE_CAPABLE': offline_capable})
        elif kind == 'same':
            # return HttpResponse('fixme: kind==same not implimented yet')
            # in this case we will have record_id in the app_info
            return _approve_and_redirect(request, REQUEST_TOKEN)
        else:
            return HttpResponse('bad value for kind parameter')
    
    # process POST
    elif request.method == HTTP_METHOD_POST \
        and request.POST.has_key('oauth_token'):
        
        app_info = api.get_request_token_info(request_token=REQUEST_TOKEN).response['response_data']
        e = ET.fromstring(app_info)
        
        name = e.findtext('App/name')
        app_id = e.find('App').attrib['id']
        kind = e.findtext('kind')
        description = e.findtext('App/description')
        
        offline_capable = request.POST.get('offline_capable', False)
        if offline_capable == "0":
            offline_capable = False
        
        return _approve_and_redirect(request, request.POST['oauth_token'], offline_capable = offline_capable)
    return HttpResponse('bad request method or missing param in request to authorize')

def _approve_and_redirect(request, request_token, account_id=None,  offline_capable=False):
    """
    carenet_id is the carenet that an access token is limited to.
    """
    
    data = {}
    if offline_capable:
        data['offline'] = 1
    
    api = get_api(request)
    result = api.approve_request_token(request_token=request_token, data=data)
    # strip location= (note: has token and verifer)
    location = urllib.unquote(result.response['prd'][9:])
    
    return HttpResponseRedirect(location)

def create_developer_account(request):
    if request.method == "GET":
        return utils.render_template('ui/create_developer_account', {})
    
    # compose data hash
    username = request.POST.get("username")
    password = request.POST.get("password")
    given_name = request.POST.get("given_name")
    family_name = request.POST.get("family_name")
    department = request.POST.get("department")
    role = request.POST.get("role")
    
    data = {"account_id": username, "password": password, 
            "given_name": given_name, "family_name": family_name, 
            "department": department, "role": role}
    
    api = get_api()
    ret = api.call("POST", "/users/", options={'data': data})
    if (ret == "account_exists"):
        return utils.render_template('ui/create_developer_account',
                                    {'ERROR': "Account '%s' is already registered."%username })
    
    return utils.render_template(LOGIN_PAGE, 
                                {'MESSAGE': "Account %s has been created. Please log in."%username,
                                 'ACCOUNT': username})

def reset_password_request(request):
    if request.method == "GET":
        account_email = request.GET.get('account_email', '')
        return utils.render_template('ui/reset_password_request', {'ACCOUNT': account_email})
    
    # must be POST, try to reset password on the server
    error = None
    account_email = request.POST.get("account_email")
    if not account_email:
        error = "Please provide your email address"
    else:
        data = {"account_email" : account_email}
        
        api = get_api()
        ret = api.call("POST", "/users/reset_password_request", options={'data': data})
        if (ret == "no_account_exists"):
            error = "Account <b>%s</b> does not exist." % account_email
    
    # show the error if there was one
    if error:
        return utils.render_template('ui/reset_password_request', {'ERROR': error})
    return utils.render_template(LOGIN_PAGE, 
                                {'MESSAGE': "Account reset link e-mailed. Please check your e-mail for the link.",
                                 'ACCOUNT': account_email})

def reset_password(request):
    if request.method == "GET":
        account=request.GET.get('account_email', None)
        secret=request.GET.get('account_secret', None)
        return utils.render_template('ui/reset_password', {'ACCOUNT': account, 'ACCOUNT_SECRET': secret})
    
    # construct the data
    account_email = request.POST.get('account_email', None)
    data = {"account_email" : account_email,
            "account_secret": request.POST.get('account_secret', None),
            "new_password": request.POST.get('new_password', None)}
    
    # post to server
    api = get_api()
    ret = api.call("POST", "/users/reset_password", options={'data': data})
    
    return utils.render_template(LOGIN_PAGE, 
                                {'MESSAGE': "Account password has been reset. Please log in below.",
                                 'ACCOUNT': account_email})
