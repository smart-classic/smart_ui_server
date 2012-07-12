################################################################################
#DO NOT WRITE TO THIS FILE
#THIS FILE WAS AUTOMATICALLY GENERATED ON SATURDAY 06/05/2010 AT 20:05:57
################################################################################
import inspect
class API:


	def __init__(self, utils_obj):
		self.utils_obj = utils_obj
		self.call_count = 0

	def call(self, *args):
		if hasattr(self, inspect.stack()[1][3]):
			count = 1
			kwargs = {}
			method = getattr(self, inspect.stack()[1][3])
			method_arguments = inspect.getargspec(method)[0]
			for arg in args:
				kwargs[method_arguments[count]] = arg
				count += 1
			self.call_count += 1
			return method(**kwargs)
		else:
			return False

	def post_access_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('post_access_token', 
					'post', 
					'/oauth/access_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def create_session(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_session', 
					'post', 
					'/oauth/internal/session_create', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def account_info(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_info', 
					'get', 
					'/accounts/{ACCOUNT_ID}', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def account_primary_secret(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_primary_secret', 
					'get', 
					'/accounts/{ACCOUNT_ID}/primary-secret', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def add_auth_system(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('add_auth_system', 
					'post', 
					'/accounts/{ACCOUNT_ID}/authsystems/', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def account_set_password(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_set_password', 
					'post', 
					'/accounts/{ACCOUNT_ID}/authsystems/password/set', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def account_change_password(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_change_password', 
					'post', 
					'/accounts/{ACCOUNT_ID}/authsystems/password/change', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def account_initialize(self, app_info,account_id='', primary_secret='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_initialize', 
					'post', 
					'/accounts/{ACCOUNT_ID}/initialize/{PRIMARY_SECRET}', 
					[], 
					app_info, 
					data, 
					account_id=account_id, primary_secret=primary_secret, debug=debug)


	def account_reset(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_reset', 
					'post', 
					'/accounts/{ACCOUNT_ID}/reset', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def post_request_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('post_request_token', 
					'post', 
					'/oauth/request_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def claim_request_token(self, app_info,request_token='',  data=None, debug=False): 
		return self.utils_obj.get_response('claim_request_token', 
					'post', 
					'/oauth/internal/request_tokens/{REQUEST_TOKEN}/claim', 
					[], 
					app_info, 
					data, 
					request_token=request_token, debug=debug)


	def get_request_token_info(self, app_info,request_token='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_request_token_info', 
					'get', 
					'/oauth/internal/request_tokens/{REQUEST_TOKEN}/info', 
					[], 
					app_info, 
					data, 
					request_token=request_token, debug=debug)


	def approve_request_token(self, app_info,request_token='',  data=None, debug=False): 
		return self.utils_obj.get_response('approve_request_token', 
					'post', 
					'/oauth/internal/request_tokens/{REQUEST_TOKEN}/approve', 
					[], 
					app_info, 
					data, 
					request_token=request_token, debug=debug)


	def create_record(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_record', 
					'post', 
					'/records/', 
					[u'Record', u'id', u'demographics', u'document_id'], 
					app_info, 
					data, 
					debug=debug)


	def create_account(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_account', 
					'post', 
					'/accounts/', 
					[u'Account', u'id'], 
					app_info, 
					data, 
					debug=debug)


	def setup_app(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('setup_app', 
					'post', 
					'/records/{RECORD_ID}/apps/{APP_ID}/setup', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def read_document(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def get_record_apps(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_record_apps', 
					'get', 
					'/records/{RECORD_ID}/apps/', 
					[u'App', u'id'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def get_authorize_token(self, app_info,token='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_authorize_token', 
					'get', 
					'/oauth/authorize?oauth_token={TOKEN}', 
					[], 
					app_info, 
					data, 
					token=token, debug=debug)


	def get_request_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_request_token', 
					'post', 
					'/oauth/request_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def get_access_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_access_token', 
					'get', 
					'/oauth/access_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def post_authorize_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('post_authorize_token', 
					'post', 
					'/oauth/authorize', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def delete_app(self, app_info,app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_app', 
					'delete', 
					'/apps/{APP_ID}', 
					[], 
					app_info, 
					data, 
					app_id=app_id, debug=debug)


	def delete_record_app(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_record_app', 
					'delete', 
					'/records/{RECORD_ID}/apps/{APP_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def get_version(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_version', 
					'get', 
					'/version', 
					[], 
					app_info, 
					data, 
					debug=debug)

