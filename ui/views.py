"""
Views for Indivo JS UI
"""

# todo: rm unused
from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpRequest
from django.contrib.auth.models import User
from django.core.exceptions import *
from django.core.urlresolvers import reverse
from django.core import serializers
from django.db import transaction
from django.conf import settings

import xml.etree.ElementTree as ET
import urllib, re

import utils
HTTP_METHOD_GET = 'GET'
HTTP_METHOD_POST = 'POST'
LOGIN_PAGE = 'ui/login'
DEBUG = True

# init the IndivoClient python object
from indivo_client_py.lib.client import IndivoClient

def get_api(request=None):
  api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, settings.INDIVO_SERVER_LOCATION)
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
  # aks - hack! re-init IndivoClient here
  api = get_api()
  tmp = api.create_session({'username' : username, 'user_pass' : password})
  
  if not tmp and DEBUG:
    utils.log('error: likely a bad username/password, or incorrect tokens from UI server to backend server.')
    return False
  
  request.session['username'] = username
  request.session['oauth_token_set'] = tmp
  request.session['account_id'] = urllib.unquote(tmp['account_id'])
  
  if DEBUG:
    utils.log('oauth_token: %(oauth_token)s outh_token_secret: %(oauth_token_secret)s' %
              request.session['oauth_token_set'])
  
  return True

def index(request):
  if tokens_p(request):
    # get the realname here. we already have it in the js account model
    api = get_api(request)
    account_id = urllib.unquote(request.session['oauth_token_set']['account_id'])
    ret = api.account_info(account_id = account_id)
    e = ET.fromstring(ret.response['response_data'])
    fullname = e.findtext('fullName')
    return utils.render_template('ui/index',
      { 'ACCOUNT_ID': account_id,
        'FULLNAME': fullname,
        'HIDE_GET_MORE_APPS': settings.HIDE_GET_MORE_APPS })
  else:
    return HttpResponseRedirect(reverse(login))

def login(request, info=""):
  """
  clear tokens in session, show a login form, get tokens from indivo_server, then redirect to index
  FIXME: make note that account will be disabled after 3 failed logins!!!
  """
  # generate a new session
  request.session.flush()
  
  # set up the template
  errors = {'missing': 'Either the username or password is missing. Please try again',
            'incorrect' : 'Incorrect username or password.  Please try again.',
            'disabled' : 'This account has been disabled/locked.'}
  
  FORM_USERNAME = 'username'
  FORM_PASSWORD = 'password'
  FORM_RETURN_URL = 'return_url'
  
  # process form vars
  if request.method == HTTP_METHOD_GET:
    return_url = request.GET.get(FORM_RETURN_URL, '/')
    return utils.render_template(LOGIN_PAGE, {FORM_RETURN_URL: return_url})
  
  if request.method == HTTP_METHOD_POST:
    return_url = request.POST.get(FORM_RETURN_URL, '/')
    if request.POST.has_key(FORM_USERNAME) and request.POST.has_key(FORM_PASSWORD):
      username = request.POST[FORM_USERNAME]
      password = request.POST[FORM_PASSWORD]
    else:
      # Also checked initially in js
      return utils.render_template(LOGIN_PAGE, {'error': errors['missing'], FORM_RETURN_URL: return_url})
  else:
    utils.log('error: bad http request method in login. redirecting to /')
    return HttpResponseRedirect('/')
  
  # get tokens from the backend server and save in this user's django session
  ret = tokens_get_from_server(request, username, password)
  if not ret:
    return utils.render_template(LOGIN_PAGE, {'error': errors['incorrect'], FORM_RETURN_URL: return_url})
  
  return HttpResponseRedirect(return_url)

def logout(request):
  # todo: have a "you have logged out message"
  request.session.flush()
  return HttpResponseRedirect('/login')

def account_initialization(request):
  """
  http://localhost/indivoapi/accounts/foo@bar.com/initialize/icmloNHxQrnCQKNn
  """
  errors = {'generic': 'There was a problem setting up your account. Please try again.'}
  api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, settings.INDIVO_SERVER_LOCATION)
  
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
    api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, settings.INDIVO_SERVER_LOCATION)
    ret = api.add_auth_system(
      account_id = account_id,
      data = {'system':'password',
              'username': username,
              'password': password}
    )
    
    if ret.response['response_status'] == 200:
      # everything's OK, log this person in, hard redirect to change location
      tokens_get_from_server(request, username, password)
      return HttpResponseRedirect('/')
    else:
      return utils.render_template('ui/account_init_2', {'ERROR': errors['generic']})
  else:
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
    # import ipdb; ipdb.set_trace()
    # if request.GET:
    #   # capture query strings
    #   p = re.compile(r'(?:[?&](?:abc=([^&]*)|xyz=([^&]*)|[^&]*))+$')
    #   res = p.findall(request.path)
    #   utils.log('indivo_api_call_get query params: ' + str(res))
    # else:
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
          {'NAME': name, 'DESCRIPTION': description, 'REQUEST_TOKEN': REQUEST_TOKEN, 'offline_capable' : offline_capable})
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
    
    location = _approve_and_redirect(request, request.POST['oauth_token'],  offline_capable = offline_capable)    
    return location
  else:
    return HttpResponse('bad request method or missing param in request to authorize')

def _approve_and_redirect(request, request_token, account_id=None,  offline_capable=False):
  """
  carenet_id is the carenet that an access token is limited to.
  """
  api = get_api(request)
  data = {}
    
  if offline_capable:
    data['offline'] = 1
  
  result = api.approve_request_token(request_token=request_token, data=data)
  # strip location= (note: has token and verifer)
  location = urllib.unquote(result.response['prd'][9:])
  return HttpResponseRedirect(location)
