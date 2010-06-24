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


	def post_document(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_document', 
					'post', 
					'/records/{RECORD_ID}/documents/', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def post_document_ext(self, app_info,record_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_document_ext', 
					'put', 
					'/records/{RECORD_ID}/documents/external/{APP_ID}/{EXTERNAL_ID}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, external_id=external_id, debug=debug)


	def message_account(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('message_account', 
					'post', 
					'/accounts/{ACCOUNT_ID}/inbox/', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def get_recapp_documents(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_recapp_documents', 
					'get', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def create_session(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_session', 
					'post', 
					'/oauth/internal/session_create', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def account_search(self, app_info,parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('account_search', 
					'get', 
					'/accounts/search?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					parameters=parameters, debug=debug)


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


	def read_record(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_record', 
					'get', 
					'/records/{RECORD_ID}', 
					[u'Record', u'id'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def replace_document(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('replace_document', 
					'post', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/replace', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def read_document_versions(self, app_info,record_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_versions', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/versions/?{PARAMETERS}', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, parameters=parameters, debug=debug)


	def put_document_relate_existing(self, app_info,record_id='', document_id='', rel_type='', other_document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_document_relate_existing', 
					'put', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/rels/{REL_TYPE}/{OTHER_DOCUMENT_ID}', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, rel_type=rel_type, other_document_id=other_document_id, debug=debug)


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


	def get_long_lived_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_long_lived_token', 
					'post', 
					'/oauth/internal/long-lived-token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def post_recapp_setup(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_recapp_setup', 
					'post', 
					'/records/{RECORD_ID}/apps/{APP_ID}/setup', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def post_recapp_document(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_recapp_document', 
					'post', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def read_document_meta(self, app_info,record_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_meta', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/meta?{PARAMETERS}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, parameters=parameters, debug=debug)


	def put_record_ext(self, app_info,app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_record_ext', 
					'put', 
					'/records/external/{APP_ID}/{EXTERNAL_ID>', 
					[], 
					app_info, 
					data, 
					app_id=app_id, debug=debug)


	def read_document_types(self, app_info,record_id='', type='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_types', 
					'get', 
					'/records/{RECORD_ID}/documents/types/{TYPE}/?{PARAMETERS}', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, type=type, parameters=parameters, debug=debug)


	def create_record(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_record', 
					'post', 
					'/records/', 
					[u'Record', u'id', u'demographics', u'document_id'], 
					app_info, 
					data, 
					debug=debug)


	def put_recapp_document_ext(self, app_info,record_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_recapp_document_ext', 
					'put', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/external/{EXTERNAL_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, external_id=external_id, debug=debug)


	def create_account(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('create_account', 
					'post', 
					'/accounts/', 
					[u'Account', u'id'], 
					app_info, 
					data, 
					debug=debug)


	def get_document_relate(self, app_info,record_id='', document_id='', rel_type='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_document_relate', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/rels/{REL_TYPE}/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, rel_type=rel_type, debug=debug)


	def read_records(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_records', 
					'get', 
					'/accounts/{ACCOUNT_ID}/records/', 
					[u'Record', u'id'], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def put_document_relate_ext(self, app_info,record_id='', document_id='', rel_type='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_document_relate_ext', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/rels/{REL_TYPE}/external/{APP_ID}/{EXTERNAL_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, rel_type=rel_type, app_id=app_id, external_id=external_id, debug=debug)


	def setup_app(self, app_info,record_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('setup_app', 
					'post', 
					'/records/{RECORD_ID}/apps/{APP_ID}/setup', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, debug=debug)


	def create_share(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('create_share', 
					'post', 
					'/records/{RECORD_ID}/shares/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def get_shares(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_shares', 
					'get', 
					'/records/{RECORD_ID}/shares/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def delete_share(self, app_info,record_id='', email='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_share', 
					'post', 
					'/records/{RECORD_ID}/shares/{EMAIL}/delete', 
					[], 
					app_info, 
					data, 
					record_id=record_id, email=email, debug=debug)


	def get_account_permissions(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_account_permissions', 
					'get', 
					'/accounts/{ACCOUNT_ID}/permissions/', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def get_carenet_account_permissions(self, app_info,carenet_id='', account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_account_permissions', 
					'get', 
					'/carenets/{CARENET_ID}/accounts/{ACCOUNT_ID}/permissions', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, account_id=account_id, debug=debug)


	def get_carenet_app_permissions(self, app_info,carenet_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_app_permissions', 
					'get', 
					'/carenets/{CARENET_ID}/apps/{APP_ID}/permissions', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, app_id=app_id, debug=debug)


	def read_document(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def set_document_status(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('set_document_status', 
					'post', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/set-status', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def read_document_status_history(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_status_history', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/status-history', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def read_carenet_document_meta(self, app_info,carenet_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_document_meta', 
					'get', 
					'/carenets/{CARENET_ID}/documents/{DOCUMENT_ID}/meta?{PARAMETERS}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					carenet_id=carenet_id, document_id=document_id, parameters=parameters, debug=debug)


	def post_document_label(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_document_label', 
					'put', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/label', 
					[u'Document', u'id', u'label', u'value'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def read_recapp_document_meta(self, app_info,record_id='', app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_recapp_document_meta', 
					'get', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/{DOCUMENT_ID}/meta', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, document_id=document_id, debug=debug)


	def put_document_ext_replace(self, app_info,record_id='', document_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_document_ext_replace', 
					'put', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/replace/external/{APP_ID}/{EXTERNAL_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, app_id=app_id, external_id=external_id, debug=debug)


	def set_record_owner(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('set_record_owner', 
					'post', 
					'/records/{RECORD_ID}/owner', 
					[u'Account', u'email'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def put_document_ext_label(self, app_info,record_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_document_ext_label', 
					'put', 
					'/records/{RECORD_ID}/documents/external/{APP_ID}/{EXTERNAL_ID}/label', 
					[u'Document', u'id', u'label', u'value'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, external_id=external_id, debug=debug)


	def get_messages(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_messages', 
					'get', 
					'/records/{RECORD_ID}/inbox/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def get_record_apps(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_record_apps', 
					'get', 
					'/records/{RECORD_ID}/apps/', 
					[u'App', u'id'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def put_recapp_document_create_or_replace(self, app_info,record_id='', app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_recapp_document_create_or_replace', 
					'put', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/{DOCUMENT_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, document_id=document_id, debug=debug)


	def read_document_ext_meta(self, app_info,record_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_ext_meta', 
					'get', 
					'/records/{RECORD_ID}/documents/external/{APP_ID}/{EXTERNAL_ID}/meta', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, external_id=external_id, debug=debug)


	def get_authorize_token(self, app_info,token='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_authorize_token', 
					'get', 
					'/oauth/authorize?oauth_token={TOKEN}', 
					[], 
					app_info, 
					data, 
					token=token, debug=debug)


	def read_recapp_document_ext_meta(self, app_info,record_id='', app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_recapp_document_ext_meta', 
					'get', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/external/{EXTERNAL_ID}/meta', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, external_id=external_id, debug=debug)


	def get_recapp_document(self, app_info,record_id='', app_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_recapp_document', 
					'get', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/{DOCUMENT_ID}?{PARAMETERS}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, document_id=document_id, parameters=parameters, debug=debug)


	def get_request_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_request_token', 
					'post', 
					'/oauth/request_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def put_message_notification(self, app_info,account_id='', notification_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_message_notification', 
					'put', 
					'/accounts/{ACCOUNT_ID}/notifications/{NOTIFICATION_ID}', 
					[], 
					app_info, 
					data, 
					account_id=account_id, notification_id=notification_id, debug=debug)


	def record_notify(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('record_notify', 
					'post', 
					'/records/{RECORD_ID}/notify', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def post_document_relate_given(self, app_info,record_id='', document_id='', rel_type='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_document_relate_given', 
					'post', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/rels/{REL_TYPE}/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, rel_type=rel_type, debug=debug)


	def put_recapp_document_label(self, app_info,record_id='', app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_recapp_document_label', 
					'put', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/{DOCUMENT_ID}/label', 
					[u'Document', u'id', u'label', u'value'], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, document_id=document_id, debug=debug)


	def read_documents(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_documents', 
					'get', 
					'/records/{RECORD_ID}/documents/?{PARAMETERS}', 
					[u'Documents', u'', u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def get_access_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_access_token', 
					'get', 
					'/oauth/access_token', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def delete_recapp_document(self, app_info,record_id='', app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_recapp_document', 
					'delete', 
					'/records/{RECORD_ID}/apps/{APP_ID}/documents/{DOCUMENT_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, app_id=app_id, document_id=document_id, debug=debug)


	def read_special_document(self, app_info,record_id='', special_document='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_special_document', 
					'get', 
					'/records/{RECORD_ID}/documents/special/{SPECIAL_DOCUMENT}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, special_document=special_document, debug=debug)


	def message_record(self, app_info,record_id='', message_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('message_record', 
					'post', 
					'/records/{RECORD_ID}/inbox/{MESSAGE_ID}', 
					[u'Result', u''], 
					app_info, 
					data, 
					record_id=record_id, message_id=message_id, debug=debug)


	def post_authorize_token(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('post_authorize_token', 
					'post', 
					'/oauth/authorize', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def put_special_document(self, app_info,record_id='', special_document='',  data=None, debug=False): 
		return self.utils_obj.get_response('put_special_document', 
					'put', 
					'/records/{RECORD_ID}/documents/special/{SPECIAL_DOCUMENT}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					record_id=record_id, special_document=special_document, debug=debug)


	def read_record_audit(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_record_audit', 
					'get', 
					'/records/{RECORD_ID}/audits/?{PARAMETERS}', 
					[u'AuditLog', u'', u'Entry', u'principal'], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_document_audit(self, app_info,record_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_document_audit', 
					'get', 
					'/records/{RECORD_ID}/audits/documents/{DOCUMENT_ID}/?{PARAMETERS}', 
					[u'AuditLog', u'', u'Entry', u'principal'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, parameters=parameters, debug=debug)


	def read_function_audit(self, app_info,record_id='', document_id='', function_name='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_function_audit', 
					'get', 
					'/records/{RECORD_ID}/audits/documents/{DOCUMENT_ID}/functions/{FUNCTION_NAME}/?{PARAMETERS}', 
					[u'AuditLog', u'', u'Entry', u'principal'], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, function_name=function_name, parameters=parameters, debug=debug)


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


	def read_app_documents(self, app_info,app_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_app_documents', 
					'get', 
					'/apps/{APP_ID}/documents/?{PARAMETERS}', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, parameters=parameters, debug=debug)


	def post_app_document(self, app_info,app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_app_document', 
					'post', 
					'/apps/{APP_ID}/documents/', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, debug=debug)


	def post_app_document_ext(self, app_info,app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_app_document_ext', 
					'put', 
					'/apps/{APP_ID}/documents/external/{EXTERNAL_ID}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, external_id=external_id, debug=debug)


	def read_app_document_meta(self, app_info,app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_app_document_meta', 
					'get', 
					'/apps/{APP_ID}/documents/{DOCUMENT_ID}/meta', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, document_id=document_id, debug=debug)


	def create_or_replace_app_document(self, app_info,app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('create_or_replace_app_document', 
					'put', 
					'/apps/{APP_ID}/documents/{DOCUMENT_ID}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, document_id=document_id, debug=debug)


	def read_app_document_ext_meta(self, app_info,app_id='', external_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_app_document_ext_meta', 
					'get', 
					'/apps/{APP_ID}/documents/external/{EXTERNAL_ID}/meta', 
					[], 
					app_info, 
					data, 
					app_id=app_id, external_id=external_id, debug=debug)


	def read_app_document(self, app_info,app_id='', document_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_app_document', 
					'get', 
					'/apps/{APP_ID}/documents/{DOCUMENT_ID}?{PARAMETERS}', 
					[u'Document', u'id'], 
					app_info, 
					data, 
					app_id=app_id, document_id=document_id, parameters=parameters, debug=debug)


	def post_app_document_label(self, app_info,app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_app_document_label', 
					'put', 
					'/apps/{APP_ID}/documents/{DOCUMENT_ID}/label', 
					[u'Document', u'id', u'label', u'value'], 
					app_info, 
					data, 
					app_id=app_id, document_id=document_id, debug=debug)


	def remove_app_document(self, app_info,app_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('remove_app_document', 
					'delete', 
					'/apps/{APP_ID}/documents/{DOCUMENT_ID}', 
					[], 
					app_info, 
					data, 
					app_id=app_id, document_id=document_id, debug=debug)


	def delete_documents(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_documents', 
					'delete', 
					'/records/{RECORD_ID}/documents/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def delete_document(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_document', 
					'delete', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def read_measurements(self, app_info,record_id='', lab_code='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_measurements', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/measurements/{LAB_CODE}/?{PARAMETERS}', 
					[u'Measurements', u'record', u'Measurement', u'id'], 
					app_info, 
					data, 
					record_id=record_id, lab_code=lab_code, parameters=parameters, debug=debug)


	def read_immunizations(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_immunizations', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/immunizations/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_allergies(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_allergies', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/allergies/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_labs(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_labs', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/labs/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_procedures(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_procedures', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/procedures/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_problems(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_problems', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/problems/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_medications(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_medications', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/medications/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_equipment(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_equipment', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/equipment/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_vitals_category(self, app_info,record_id='', category='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_vitals_category', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/vitals/{CATEGORY}/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, category=category, parameters=parameters, debug=debug)


	def read_vitals(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_vitals', 
					'get', 
					'/records/{RECORD_ID}/reports/minimal/vitals/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def read_carenet_measurements(self, app_info,carenet_id='', lab_code='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_measurements', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/measurements/{LAB_CODE}/?{PARAMETERS}', 
					[u'Measurements', u'record', u'Measurement', u'id'], 
					app_info, 
					data, 
					carenet_id=carenet_id, lab_code=lab_code, parameters=parameters, debug=debug)


	def read_carenet_immunizations(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_immunizations', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/immunizations/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_allergies(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_allergies', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/allergies/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_procedures(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_procedures', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/procedures/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_problems(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_problems', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/problems/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_medications(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_medications', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/medications/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_equipment(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_equipment', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/equipment/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def read_carenet_vitals_category(self, app_info,carenet_id='', category='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_vitals_category', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/vitals/{CATEGORY}/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, category=category, parameters=parameters, debug=debug)


	def read_carenet_vitals(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('read_carenet_vitals', 
					'get', 
					'/carenets/{CARENET_ID}/reports/minimal/vitals/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def get_autoshare(self, app_info,record_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_autoshare', 
					'get', 
					'/records/{RECORD_ID}/autoshare/bytype/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, parameters=parameters, debug=debug)


	def post_autoshare(self, app_info,record_id='', carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_autoshare', 
					'post', 
					'/records/{RECORD_ID}/autoshare/carenets/{CARENET_ID}/bytype/set', 
					[], 
					app_info, 
					data, 
					record_id=record_id, carenet_id=carenet_id, debug=debug)


	def delete_autoshare(self, app_info,record_id='', carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_autoshare', 
					'post', 
					'/records/{RECORD_ID}/autoshare/carenets/{CARENET_ID}/bytype/unset', 
					[], 
					app_info, 
					data, 
					record_id=record_id, carenet_id=carenet_id, debug=debug)


	def lookup_code(self, app_info,coding_system='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('lookup_code', 
					'get', 
					'/codes/systems/{CODING_SYSTEM}/query?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					coding_system=coding_system, parameters=parameters, debug=debug)


	def get_account_records(self, app_info,account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_account_records', 
					'get', 
					'/accounts/{ACCOUNT_ID}/records/', 
					[], 
					app_info, 
					data, 
					account_id=account_id, debug=debug)


	def get_carenet_apps(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_apps', 
					'get', 
					'/carenets/{CARENET_ID}/apps/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def get_carenet_accounts(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_accounts', 
					'get', 
					'/carenets/{CARENET_ID}/accounts/?{PARAMETERS}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def post_carenet_account(self, app_info,carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_carenet_account', 
					'post', 
					'/carenets/{CARENET_ID}/accounts/', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, debug=debug)


	def delete_carenet_account(self, app_info,carenet_id='', account_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_carenet_account', 
					'delete', 
					'/carenets/{CARENET_ID}/accounts/{ACCOUNT_ID}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, account_id=account_id, debug=debug)


	def delete_carenet_document(self, app_info,record_id='', document_id='', carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('delete_carenet_document', 
					'delete', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/carenets/{CARENET_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, carenet_id=carenet_id, debug=debug)


	def create_carenet(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('create_carenet', 
					'post', 
					'/records/{RECORD_ID}/carenets/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def get_record_carenets(self, app_info,record_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_record_carenets', 
					'get', 
					'/records/{RECORD_ID}/carenets/', 
					[u'Carenets', u'record_id', u'Carenet', u'id'], 
					app_info, 
					data, 
					record_id=record_id, debug=debug)


	def get_document_carenets(self, app_info,record_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_document_carenets', 
					'get', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/carenets/', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, debug=debug)


	def get_carenet_record(self, app_info,carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_record', 
					'get', 
					'/carenets/{CARENET_ID}/record', 
					[u'Record', u'id'], 
					app_info, 
					data, 
					carenet_id=carenet_id, debug=debug)


	def get_carenet_documents(self, app_info,carenet_id='', parameters='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_documents', 
					'get', 
					'/carenets/{CARENET_ID}/documents/?{PARAMETERS}', 
					[u'Documents', u'record_id', u'Document', u'id'], 
					app_info, 
					data, 
					carenet_id=carenet_id, parameters=parameters, debug=debug)


	def get_carenet_document(self, app_info,carenet_id='', document_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('get_carenet_document', 
					'get', 
					'/carenets/{CARENET_ID}/documents/{DOCUMENT_ID}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, document_id=document_id, debug=debug)


	def post_carenet_document(self, app_info,record_id='', document_id='', carenet_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_carenet_document', 
					'put', 
					'/records/{RECORD_ID}/documents/{DOCUMENT_ID}/carenets/{CARENET_ID}', 
					[], 
					app_info, 
					data, 
					record_id=record_id, document_id=document_id, carenet_id=carenet_id, debug=debug)


	def get_version(self, app_info, data=None, debug=False): 
		return self.utils_obj.get_response('get_version', 
					'get', 
					'/version', 
					[], 
					app_info, 
					data, 
					debug=debug)


	def post_carenet_app(self, app_info,carenet_id='', app_id='',  data=None, debug=False): 
		return self.utils_obj.get_response('post_carenet_app', 
					'put', 
					'/carenets/{CARENET_ID}/apps/{APP_ID}', 
					[], 
					app_info, 
					data, 
					carenet_id=carenet_id, app_id=app_id, debug=debug)
