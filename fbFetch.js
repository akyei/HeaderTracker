function quantileSorted(sample, p) {
	var idx = (sample.length) * p;
//	console.log(idx);
	if ( p < 0 || p > 1 ) {
		return null;
	} else if ( p == 1) {
		return sample[sample.length-1];
	} else if ( p == 0) {
		return sample[0];
	} else if (idx % 1 != 0) {
		return sample[Math.ceil(idx) - 1];
	} else if ( sample.length %2 == 0) {
		return (sample[idx-1] + sample[idx])/2;
	} else {
		return sample[idx];	
	}
}

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
var currUserRef;
//StorageArea.get('userid', function(items) {
chrome.storage.sync.get('userid', function(items) {
	var userid = items.userid;
	currUserString = items.userid;
	if (userid) {
		console.log("Found, using " + userid);
		//console.log("hi" + getRandomToken());
		useToken(userid);
		var obj = {};
		//console.log(currUserRef);
		var graphObj = [];
		var graphObjText = [];
		var frequencies = [];
		var userInput;
		currUserRef.once("value", function(snapshot) {
			obj = snapshot.val();
			console.log(snapshot.val());
			for (var key in obj){
				var amt = obj[key];
				frequencies.push(amt);
				var temp = Array.apply(null, Array(amt)).map(function() { return key.toLowerCase() });
				graphObjText.push(key);
				graphObj = graphObj.concat(temp);
			}
		//document.write(graphObj)
		var data = [ { 
			x: graphObj,
			type: 'histogram',
			name: 'My Histogram',
			text: graphObjText,
			showlegend: true,
			layout: {
				title: 'Header Histogram',
				autosize: true,
				margin: {
					pad: 30
				}	
			}
		} ];
		Plotly.newPlot('histogram', data);
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
		$(document).ready(function() { 
			$('#goButton').click(function() {
				$('#headerBody').empty();
				//$('#sliderOutput').val($('#slider').val()+"%");
				userInput = parseFloat($('#slider').val());
				console.log("before: "+frequencies);
				frequencies.sort(function(a, b) {
					return a - b;
				});
				console.log("after: " + frequencies);
				var threshold = quantileSorted(frequencies, userInput/100);
				var rareObj = [];
				var rareAmt = [];
				for (var key in obj) {
					var amt = obj[key];
					if (amt <= threshold) {
						rareObj.push(key);
						rareAmt.push(amt);
					} 
				}
				var data2 = [ { 
					x: rareObj,
					y: rareAmt,
					type: 'bar' } ];
				Plotly.newPlot('rareHistogram', data2);
				rareObj.forEach(function(element, index, array) {
					$('#headerBody').append('<tr><td>' + element +'</td><td>' + rareAmt[index] + '</td></tr>');
				});
					
			});
		});
		
	} else {
		userid = getRandomToken();
		//StorageArea.set({userid: userid}, function() {
		chrome.storage.sync.set({userid: userid}, function() {
			console.log("not found, setting" + userid);
			useToken(userid);
		});
	}
	function useToken(userid){
		currUserString = userid;
		currUserRef = new Firebase('https://sizzling-heat-7326.firebaseio.com/users/' + currUserString +"/");
		return 	userid;
	}

});

//var currUserRef = new Firebase('https://sizzling-heat-7326.firebaseio.com/users/' + currUserString +"/");

