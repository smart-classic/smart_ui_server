function OAuthSignatureMethodSHA1() {
    this.name = 'SHA1';
    this.sign = function(request){
	var signature = Crypto.SHA1(request, {asBytes: true});		
        return Crypto.util.bytesToBase64(signature);
    };
}

OAuthSignatureMethodSHA1.prototype = new OAuthSignatureMethod();

OAuthConsumer.signatureMethods['SHA1'] = OAuthSignatureMethodSHA1;

