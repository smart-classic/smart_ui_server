function OAuthUtilities() {}

OAuthUtilities.urlEncode = function(string){
	if (!string) return '';
	
    var reserved_chars = / |!|\*|"|'|\(|\)|;|:|@|&|=|\+|\$|,|\/|\?|%|#|\[|\]|<|>|{|}|\||\\|`|\^/, 
        str_len = string.length, i, string_arr = string.split? string.split('') : [];
                          
    for (i = 0; i < str_len; i++) {
        if (string_arr[i].match(reserved_chars)) {
            string_arr[i] = '%' + (string_arr[i].charCodeAt(0)).toString(16).toUpperCase();
        }
    }

    return string_arr.join('');
};


OAuthUtilities.urlForSignatureBaseString = function(string){
	port_match_http = string.match("http://(.*):80([^0-9]|$)(.*)")
	port_match_https = string.match("https://(.*):443([^0-9]|$)(.*)")
	
	if (port_match_http)
		return "http://"+port_match_http[1]+port_match_http[2]+port_match_http[3];
	
	else if (port_match_https)
		return "https://"+port_match_http[1]+port_match_http[2]+port_match_http[3]; 
		
	else
		return string;
};


OAuthUtilities.urlDecode = function(string){
	if (!string) return '';
                          
    return string.replace(/%[a-fA-F0-9]{2}/ig, function (match) {
		return String.fromCharCode(parseInt(match.replace('%', ''), 16));
	});
};