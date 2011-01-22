from django.conf.urls.defaults import *
from django.conf import settings
from ui.views import *
from widget_views import *

# maps url patterns to methods in views.py
urlpatterns = patterns(
    '',
    # testing
    (r'^$', index),

    # auth
    (r'^login$', login),
    (r'^logout$', logout),

    # special case for account init emails
    # http://localhost/indivoapi/accounts/catherine800@indivohealth.org/initialize/icmloNHxQrnCQKNn
    (r'^indivoapi/accounts/[^/]*/initialize/account_initialization_2', account_initialization_2),
    (r'^indivoapi/accounts/[^/]*/initialize/.*', account_initialization),

    # indivo api calls
    (r'^indivoapi/delete_record_app/$', indivo_api_call_delete_record_app),
    (r'^indivoapi/', indivo_api_call_get),
    (r'^smart_api/', indivo_api_call_get),  # AWFUL hack relies on 10-letter name.
    (r'^smart_passthrough/', smart_passthrough), 
    (r'^accounts/(?P<account_id>[^/]+)/apps/(?P<pha_email>[^/]+)/records/(?P<record_id>[^/]+)/launch$', launch_app),

    # oauth
    (r'^oauth/authorize$', authorize),

    # widgets
    (r'^lib/(?P<path>[^/]*)$', 'django.views.static.serve', {'document_root': settings.SMART_UI_BASE + '/ui/lib'}),
    (r'^widgets/DocumentAccess$', document_access),

    (r'^create_developer_account$', create_developer_account),
    (r'^reset_password_request$', reset_password_request),
    (r'^reset_password$', reset_password),
    # static
    (r'^static/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.SMART_UI_BASE + '/ui/static'}),
)
