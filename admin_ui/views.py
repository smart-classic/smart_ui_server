from django.http import HttpResponse, HttpResponseRedirect, Http404, HttpResponseForbidden, HttpRequest
from django.core.exceptions import *
from django.core.urlresolvers import reverse
from django.conf import settings

import urllib
import urlparse
from smart_ui_server import utils
from smart_ui_server.ui.views import login, logout
import json

HTTP_METHOD_GET = 'GET'
HTTP_METHOD_POST = 'POST'
INDEX_PAGE = 'admin_ui/index'
LOGIN_PAGE = 'admin_ui/login'
DEBUG = True

from indivo_client_py.lib.client import IndivoClient

SMART_SERVER_LOCATION = urlparse.urlparse(settings.SMART_API_SERVER_BASE)
SMART_SERVER_LOCATION = {
    'host': SMART_SERVER_LOCATION.hostname,
    'scheme': SMART_SERVER_LOCATION.scheme,
    'port': SMART_SERVER_LOCATION.port or (
        SMART_SERVER_LOCATION.scheme == 'http' and '80' or
        SMART_SERVER_LOCATION.scheme == 'https' and '443'
    )
}


def admin_login_url(request):
        url = "%s?return_url=%s" % (reverse(login), urllib.quote(request.get_full_path()))
        return url


def get_api(request=None):
    api = IndivoClient(settings.CONSUMER_KEY, settings.CONSUMER_SECRET, SMART_SERVER_LOCATION)
    if request:
        api.update_token(request.session['oauth_token_set'])

    return api


def admin_tokens_p(request):
    try:
        if request.session['oauth_token_set'] \
            and request.session['username'] in settings.ADMIN_USER_ID:
            return True
        else:
            return False
    except KeyError:
        return False


def tokens_get_from_server(request, username, password):
    # aks - hack! re-init IndivoClient here
    api = get_api()
    tmp = api.create_session({'username': username, 'user_pass': password})

    if not tmp and DEBUG:
        utils.log('error: likely a bad username/password, or incorrect tokens from UI server to backend server.')
        return False

    request.session['username'] = username
    request.session['oauth_token_set'] = tmp
    request.session['account_id'] = urllib.unquote(tmp['account_id'])

    if DEBUG:
        utils.log('oauth_token: %(oauth_token)s outh_token_secret: %(oauth_token_secret)s' % request.session['oauth_token_set'])

    return True


def index(request, template=INDEX_PAGE):
    if not admin_tokens_p(request):
        return HttpResponseRedirect(admin_login_url(request))

    response = smart_call(request, "GET", "/apps/manifests/")
    data = json.loads(str(response.content))
    apps = sorted(data, key=lambda k: k['name'])
    
    # fetch OAuth credentials
    for app in apps:
        ret = smart_call(request, "GET", "/apps/%s/credentials" % app['id'])
        creds = json.loads(ret.content)
        app['consumer_key'] = creds['consumer_key']
        app['consumer_secret'] = creds['consumer_secret']

    return utils.render_template(template, {"apps": apps})


def manifest_add(request):
    if not admin_tokens_p(request):
        return HttpResponseRedirect(admin_login_url(request))

    if request.method == HTTP_METHOD_POST:
        data = ""

        filenames = [filename for filename, file in request.FILES.iteritems()]
        if len(filenames) > 0:
            data = "".join([chunk for chunk in request.FILES[filenames[0]].chunks()])

        manifest = json.loads(data)
        descriptor = manifest["id"]

        smart_call(request, "PUT", "/apps/%s/manifest" % descriptor, data)

    return HttpResponseRedirect(reverse(index))


def manifest_delete(request):
    if not admin_tokens_p(request):
        return HttpResponseRedirect(admin_login_url(request))

    if request.method == HTTP_METHOD_POST and 'id' in request.POST:
        id = request.POST['id']
        smart_call(request, "DELETE", "/apps/%s/manifest" % id)

    return HttpResponseRedirect(reverse(index))


def smart_call(request, method, path, data={}):
    api = get_api()
    ret = HttpResponse(api.call(method, path, options={'data': data}), mimetype="application/xml")
    return ret
