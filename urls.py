from django.conf.urls.defaults import *

urlpatterns = patterns('',
    # Coding Systems
    (r'^admin_ui/', include('smart_ui_server.admin_ui.urls')),

     # Everything to indivo
    (r'^', include('smart_ui_server.ui.urls')),
)
