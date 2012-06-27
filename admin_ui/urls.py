from django.conf.urls.defaults import *

import admin_ui.urls

urlpatterns = patterns('',
   url(r'^admin/', include(admin_ui.urls)),
)
