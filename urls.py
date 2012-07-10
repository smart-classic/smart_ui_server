from django.conf.urls.defaults import *
from django.conf import settings

urlpatterns = patterns('')

if 'admin_ui' in settings.INSTALLED_APPS:
    urlpatterns.extend(patterns('', 
        (r'^admin_ui/', include('smart_ui_server.admin_ui.urls'))))

urlpatterns.extend(
    patterns('',
    (r'^', include('smart_ui_server.ui.urls')),
    )   
)

