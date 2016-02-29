function getRandomToken() {
	var randomPool = new Uint8Array(32);
	crypto.getRandomValues(randomPool);
	var hex = '';
	for (var i = 0; i < randomPool.length; i++){
		hex += randomPool[i].toString(16);
	}
	console.log(hex);
	return hex;
}
var currUserString;
//StorageArea.get('userid', function(items) {
chrome.storage.sync.get('userid', function(items) {
	var userid = items.userid;
	currUserString = items.userid;
	if (userid) {
		console.log(userid);
		console.log("hi" + getRandomToken());
		useToken(userid);
	} else {
		userid = getRandomToken();
		//StorageArea.set({userid: userid}, function() {
		chrome.storage.sync.set({userid: userid}, function() {
			console.log(userid);
			useToken(userid);
		});
	}
	function useToken(userid){
		currUserString = userid;
		return 	userid;
	}

});

var myDataRef = new Firebase('https://sizzling-heat-7326.firebaseio.com/');
var usersRef = myDataRef.child("users");
var currUserRef = new Firebase('https://sizzling-heat-7326.firebaseio.com/users/' + currUserString);
var obj = {};
obj[currUserString] = {};
console.log(currUserString);
currUserRef.on("value", function(snapshot) {

if (snapshot.val() == null){
	usersRef.set(obj);//{currUserString: {}});
}

});

var url;
var headers;
var urlObj = {};
var re = /^https?:\/\/(?:www\.)?(.*?)\.(?:com)([^$]|$)/i;
var fittedURL;
chrome.webRequest.onHeadersReceived.addListener(function(details){
		url = details.url;
		headers = details.responseHeaders;
				
		fittedURL = url.match(re);
		if (fittedURL != null){
		fittedURL[1] = fittedURL[1].replace(/\./g, "(dot)");
		fittedURL[1] = fittedURL[1].replace(/\//g, "");
		//console.log(url);
		//console.log(headers);
		console.log(fittedURL[1]);
		urlObj[fittedURL[1]] = [];
		headers.forEach(function(element, index, array){
			console.log(element.name);
			urlObj[fittedURL[1]].push(element.name);
			console.log(urlObj[fittedURL[1]]);
		});
		currUserRef.update(urlObj);	
		//urlObj[fittedURL[1]] = headers;//details.responseHeaders;
	//	currUserRef.update(urlObj);//{details.url: headers});	
		}
	}, {urls: ["*://*.com/*"]}, ["responseHeaders"]);
