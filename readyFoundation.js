$(document).foundation();
//function outputUpdate(vol) {
//	console.log(vol);
//	console.log(vol.target);
//	document.querySelector('#sliderOutput').value = vol.result;
//}
$('#slider').change(function() {
	$('#chosenPercent').val($('#slider').val()+'%');
	$('#sliderOutput').val($('#slider').val()+'%');
});
