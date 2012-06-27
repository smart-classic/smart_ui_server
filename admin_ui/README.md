The Admin UI client app is currently organized as a stand-alone
django app. In order to run the app copy the "settings.py.default" file
as "settings.py". Edit "settings.py" to match your SMART server configuration
(in particular, the settings SMART_APP_SERVER_BASE, ADMIN_USER_ID,
INSTALLED_APPS, SMART_API_SERVER_BASE, CONSUMER_SECRET). You can now
run the app with the following command:

<pre>
   python manage.py runserver 0.0.0.0:8000
</pre>

The app should respond to the following URL:

<pre>
   http://localhost:8000/admin/
</pre>
