from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseForbidden, HttpRequest
from django.core.exceptions import *
from django.core.urlresolvers import reverse
from django.conf import settings

import urllib, urlparse
import utils
import json

HTTP_METHOD_GET = 'GET'
HTTP_METHOD_POST = 'POST'
INDEX_PAGE = 'admin_ui/index'
LOGIN_PAGE = 'admin_ui/login'
DEBUG = True

from indivo_client_py.lib.client import IndivoClient

SMART_SERVER_LOCATION = urlparse.urlparse(settings.SMART_API_SERVER_BASE)
SMART_SERVER_LOCATION = {
  'host':SMART_SERVER_LOCATION.hostname,
  'scheme': SMART_SERVER_LOCATION.scheme,
  'port': SMART_SERVER_LOCATION.port or (
    SMART_SERVER_LOCATION.scheme=='http' and '80' or 
    SMART_SERVER_LOCATION.scheme=='https' and '443')
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

def index(request, template=INDEX_PAGE):
  if tokens_p(request):
    
    response = smart_call(request, "GET", "/apps/manifests/")
    data = json.loads(str(response.content))
    data = [{"name":d["name"], "id":d["id"]} for d in data]                
    data.sort();
            
    return utils.render_template(template,{"apps":data, "target": settings.REPLACE_STRING, "replace":settings.SMART_APP_SERVER_BASE})
  else:
    return HttpResponseRedirect(reverse(login))
    
def manifest_add (request):
    if request.method == HTTP_METHOD_POST:
        data = ""
        
        filenames = [filename for filename, file in request.FILES.iteritems()]
        if len(filenames) > 0:
            data = "".join([chunk for chunk in request.FILES[filenames[0]].chunks()])
                
        data.replace (settings.REPLACE_STRING, settings.SMART_APP_SERVER_BASE)
        
        smart_call(request, "PUT", "/apps/%s/manifest"%"app@host", data)
    
    return HttpResponseRedirect(reverse(index))
    
def manifest_delete (request):
    if request.method == HTTP_METHOD_POST and request.POST.has_key('id'):
        id = request.POST['id']
        smart_call(request, "DELETE", "/apps/%s/manifest"%id)
    
    return HttpResponseRedirect(reverse(index))
  
def login(request, info="", template=LOGIN_PAGE):
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
    return_url = request.GET.get(FORM_RETURN_URL, reverse(index))
    if (return_url.strip()==""): return_url=reverse(index)
    template_data = {FORM_RETURN_URL: return_url}

    return utils.render_template(template, 
                                 template_data
                                 )
  
  if request.method == HTTP_METHOD_POST:
    return_url = request.POST.get(FORM_RETURN_URL, reverse(index))
    if (return_url.strip()==""): return_url=reverse(index)
    if request.POST.has_key(FORM_USERNAME) and request.POST.has_key(FORM_PASSWORD):
      username = request.POST[FORM_USERNAME]
      password = request.POST[FORM_PASSWORD]
    else:
      # Also checked initially in js
      return utils.render_template(template, {'error': errors['missing'], FORM_RETURN_URL: return_url})
  else:
    utils.log('error: bad http request method in login. redirecting to /')
    return HttpResponseRedirect(reverse(index))
  
  # get tokens from the backend server and save in this user's django session  
  ret = False
  if settings.ADMIN_UI and username == settings.ADMIN_USER_ID:
    ret = tokens_get_from_server(request, username, password)
  if not ret:
    return utils.render_template(LOGIN_PAGE, {'error': errors['incorrect'], FORM_RETURN_URL: return_url})
  return HttpResponseRedirect(return_url)

def logout(request):
  request.session.flush()
  return HttpResponseRedirect(reverse(login))
  
def smart_call(request, method, path, data={}):  
  if not tokens_p(request):
    return HttpResponseRedirect(reverse(login))
  
  api = get_api()
  ret = HttpResponse(api.call(method, path, options= {'data': data}), mimetype="application/xml")
  return ret