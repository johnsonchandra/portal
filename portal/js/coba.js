var portal = {
	url_api: 'http://localhost:8080/json/',
	url_scripts: 'portal/js/',
	url_styles: 'portal/css/',
	url_pages: 'portal/pages/',
	ver: '800-000-1616.95.20150622',
};

function getParameter(name) {
	var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
		regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function acak(min, max, whole) {
	console.log("acak called...");
	return void 0===whole||!1===whole?Math.random()*(max-min+1)+min:!isNaN(parseFloat(whole))&&0<=parseFloat(whole)&&20>=parseFloat(whole)?(Math.random()*(max-min+1)+min).toFixed(whole):Math.floor(Math.random()*(max-min+1))+min;
};

function checkDevice(){
	var userAgent = navigator.userAgent.toLowerCase();
	if( /windows phone/i.test(userAgent) ){
		return "windowsPhone";
	}else
	if( /android/i.test(userAgent) ){
		return "Android";
	}else
	if( /ipad|iphone|ipod/i.test(userAgent) ){
		return "iOS";
	}else{
		return "Browser";
	}
}// end checkDevice



function getData(requestUrl, requestType, responseType, parameters, $this, callback) {
	var request = $.ajax({
		type: requestType,
		url: requestUrl,
		data: parameters,
		dataType: responseType
	});

	request.done(function(data, status, xhr) {
		callback($this, data);
	})// end request.done

	request.fail(function(xhr, status, error) {
		console.log('%c Error when requesting to "' + requestUrl + '" ');
		callback($this, null);
	})
}// end getPage

function parseData($this, data){
	console.log('parseData called....');
	
	
};

function parsePage($this, pageContent){
	if(pageContent){
		var apiName = $this.data('wp-apiname');
		console.log('id: '+$this.data('wp-blockname')+', apiName: '+apiName);
		
		if(apiName){
			console.log('yg undefined seharusnya gak masuk sini apiName: '+apiName);
			
			// apiName is given, now get the data from backend
			var default_params_value = $this.data( 'wp-'+apiName.toLowerCase() ) ;
			
			var api_params_in = api_params[apiName]["params_in"];
			var parameters = {};
			parameters.pdid = localStorage['pdid'];
			parameters.drid = localStorage['drid'];
			parameters.dtk = localStorage['dtk'];
			
			var index_params_in = 0;

			while(index_params_in < api_params_in.length){
				var api_params_in_Name = api_params_in[index_params_in];
				var valueFromRequest = getParameter(api_params_in_Name);

				if(valueFromRequest == "" ){
					if(default_params_value){
						console.log('ada default params value');
						parameters[api_params_in_Name] = default_params_value[api_params_in_Name];
					}else{
						console.log('GAK ada default params value');
						parameters[api_params_in_Name] = portal[api_params_in_Name];
					}
				}else{
					if(default_params_value['enforce']){
						parameters[api_params_in_Name] = default_params_value[api_params_in_Name];
					}else{
						parameters[api_params_in_Name] = valueFromRequest;
					}
				}// end else if valueFromRequest == ""
				index_params_in++;
			}// end while setting field parameters

			console.log('portal.url_api+apiName: '+portal.url_api+apiName);
			getData(portal.url_api+apiName, 'POST', 'json', parameters, $this, parseData);
			
		}// end if apiName
		
		$this.append(pageContent);
		
		var $namaApi = $this.find('[data-wpapi-coba]');
		
		$($namaApi).each(function(){
			$this = $(this);
			// console.log("nama wpapi coba: "+$this.data('wpapi-coba'));
		});
		
	}else{
		// fatal error handling
		console.log('fatal error handling');
	}// end else if pageContent
};

function registerNewDevice(drid, response){
	
	if (response.wpCode === "999") {
		console.log("now writing to local storage");

		localStorage.setItem("pdid",response.pdid);
		localStorage.setItem("drid",drid);

		parseBuildingBlocks();
		
	}else{
		console.log("something not right happened...");
		console.log("error code: "+response.wpCode);
		console.log("error message: "+response.wpMessage);

		alert("error code: "+response.wpCode+", error message: "+response.wpMessage);
		window.location = "error.html";
	}
	
};// end registerNewDevice

function parseBuildingBlocks(){
	var $pages = $('[data-wp-blockname]');
	$($pages).each(function(){
		$this = $(this);		
		
		var blockName = $this.data('wp-blockname');
		console.log('now get: '+blockName);
		console.log('portal.url_pages: '+portal.url_pages);
		
		getData(portal.url_pages+blockName, 'GET', 'html', null, $this, parsePage);
	});
}// end parseBlockName

$(function(){
	
	if(!Modernizr.localstorage){
		window.location = "not_supported.html";
	}

	console.log("portal.ver: "+portal.ver);

	var pdid = localStorage["pdid"];
	console.log("pdid: "+pdid);

	var drid = localStorage["drid"];
	console.log("drid: "+drid);

	if(pdid == null || drid == null){
		console.log("pdid or drid is null, now trying to get pdid from backend");
		var drid = acak(1,100000000000,0);
		var parameters = {};
		parameters.ver = portal.ver;
		parameters.drid = drid
		parameters.userDevice = checkDevice()

		getData(portal.url_api+'registerNewDevice', 'POST', 'json', parameters, drid, registerNewDevice);
		
	}else{
		parseBuildingBlocks();
	}// end pdid drid null

}); // end $(function(){
