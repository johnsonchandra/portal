var portal = {
	api: 'http://localhost:8080/json/',
	uri_scripts: 'portal/js/',
	uri_styles: 'portal/css/',
	uri_pages: 'portal/pages/',
	ver: '800-000-1616.95.20150622',
};


function getData(apiName, parameters, callback) {
	var request = $.ajax({
		type: "POST",
		url: portal.api + apiName,
		data: parameters,
		dataType: 'json'
	});

	request.done(function(data, status, xhr) {
		console.log("data.wpCode: "+data.wpCode);
		data.apiName = apiName;
		
		if (typeof(callback) == "function") {
			callback(data);
		}		
		
	})// end request.done

	request.fail(function(xhr, status, error) {
		// console.log(xhr, status, error);
		console.log('%c Error when requesting to "' + apiName + '" ', dev.log.error);
		// this is very bad. either server not responding or failed security check
		// FIXME if user hasnt login yet, it still fail. this affects the error-handling.
		// FIXME if user hasnt logined yet, must reply with wpCode!!!
		// bisa bedain gak yah di belakang, antara yg musti login sama yg beneran error. mungkin harus oprek framework ofbiz dikit

		// window.location = "error.html";

		// $('[data-api-name="'+apiName+'"]').remove();
		var data = {};
		data.wpCode = "-1";
		data.wpMessage = "Fatal Error";
		
		if (typeof(callback) == "function") {
			callback(data);
		}		
		
	})
}// end getData


function parsePage(){

	var apis = $('document').data('api-name');

	var apiNames = [];
	if(apis)
		apiNames = apis.split(',');

	for (var indexApiName = 0; indexApiName < apiNames.length; indexApiName++) {
	   var apiName = $.trim(apiNames[indexApiName]);
	   var default_params_value = $pageNow.data( apiName.toLowerCase() ) ;
	   console.log("apiName: "+apiName);
	   callApi(apiName, default_params_value);
	}// end for apiNames

	$pageNow.removeAttr("data-api-name");
	$pageNow.removeData("api-name");

}; // end document on parsePage

/*
 * example of using
 * loadJsCssFile("myscript.js", "js") //dynamically load and add this .js file
 * loadJsCssFile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
 * loadJsCssFile("mystyle.css", "css") ////dynamically load and add this .css file
*/
function loadJsCssFile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}// end loadJsCssFile

$(function(){

	//FIXME TESTING KALAU SUDAH DI WEB SERVER, apakah masih bener perhitungan index titiknya
	var pathname = window.location.pathname
	// alert("window.location.pathname: "+pathname);
	var titikHtml = pathname.lastIndexOf(".html");
	// alert("titikHtml: "+titikHtml);
	var garisMiring = pathname.lastIndexOf("/");
	
	pathname = pathname.substring(garisMiring+1, titikHtml);
	// alert("pathname now: "+pathname);
	
	loadJsCssFile(portal.uri_scripts+pathname+".js", "js");

		
}); // end $(function(){
