var portal = {
	url_api: 'http://localhost:8080/json/',
	url_scripts: 'portal/js/',
	url_styles: 'portal/css/',
//	url_pages: 'portal/pages/',
	url_pages: 'http://localhost:8080/pages/',
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
		data.apiName = 
		callback($this, data);
	})// end request.done

	request.fail(function(xhr, status, error) {
		console.log('Error when requesting to "' + requestUrl + '" ');
		callback($this, null);
	})
}// end getPage

function parseData($this, data){	
	if(data){
		if(data.wpCode === "999") {
//			$.each( $this.data(),function(i, e) {
//				console.log('name='+ i + ' value=' +e);
//			});
			
			var apiName = $this.data('wp-apiname');
			console.log('parseData called for -'+apiName+'- has ok response');
			
			var field_name 	= api_params[apiName]['params_out']['field_name'];
			var field_data 	= data[field_name];
			
			// just uncomment below line if you want to save to memory for later use
			// api_params[apiName]['params_out']['field_data'] = field_data;
			
			var $apiLoops = $this.find('[data-wp-looptype]');
			
			console.log("$this di dalam parseData: "+$this.attr('id'));
			console.log("$apiLoops di dalam parseData: "+$apiLoops.attr('id'));
			

			var indexLoop = 0;
			$($apiLoops).each(function(){
				$thisApiLoop = $(this);
				
				console.log($thisApiLoop.attr('id'));
				
				var loopType = $thisApiLoop.data('wp-looptype');
						
				if(loopType === "list"){
					var $apiRecords = $this.find('[data-wp-record="record"]');
					var indexApiRecord = 0;
	
					$($apiRecords).each(function(){
						$thisApiRecord = $(this);
						for (var indexRecord=0; indexRecord < field_data.length; indexRecord++){
	
							var $apiFields = $thisApiRecord.find('[data-wp-field]');
	
							$($apiFields).each(function(){
								
								var $thisApiField = $(this);
								var fieldNameInElement = $thisApiField.data('wp-field');
	
								// console.log('fieldNameInElement: '+fieldNameInElement);
								
								if($thisApiField.prop("tagName") == "IMG"){
									$thisApiField.attr("src", field_data[indexRecord][fieldNameInElement]);
								}
								else if($thisApiField.prop("tagName") == "A"){
									var apiLink = $thisApiField.data('wp-link');
									var hrefNew = $thisApiField.data('wp-href');
	
									if(apiLink === "dynamic"){
										hrefNew = field_data[indexRecord][hrefNew];
									}
	
									hrefNew = hrefNew + "?";
	
									// var hrefNew = $thisApiField.data('api-href')+"?";
	
									var fieldLinks = fieldNameInElement.split(',');
	
									var indexFieldLink = 0;
									while(indexFieldLink < fieldLinks.length){
										var fieldLinkName = fieldLinks[indexFieldLink];
										hrefNew = hrefNew+fieldLinkName+"="+field_data[indexRecord][fieldLinkName]+"&";
										indexFieldLink++;
									}// end while indexFieldLink
									hrefNew = hrefNew.substring(0, (hrefNew.length-1) );
									$thisApiField.attr("href", hrefNew);
								}else{
									if(field_data[indexRecord][fieldNameInElement])
										$thisApiField.text(field_data[indexRecord][fieldNameInElement]);
								} //end else if
							});// end apiField.each
	
							$thisApiLoop.append($thisApiRecord.clone().attr('id',apiName+'_'+indexLoop+'_'+indexApiRecord+'_'+indexRecord));
	
						};// end for indexRecord
						$thisApiRecord.first().remove();
	
						indexApiRecord++;
					});// end apiRecords.each
				
					
				}// end if loopType list

				indexLoop++;
			});// end apiLoop.each
				
		}else{
			// FIXME buat error handling untuk wpCode lainnya
			console.log('response is not ok. parseData called for -'+apiName+'- has code: '+data.wpCode+', message: '+data.wpMessage);
			
		}// end if wpCode 999
	}else{
		console.log('parseData called for -'+apiName+'- has error response');

	}
	
};// end parseData

function parseApiName($this, pageContent){
	if(pageContent){
		$this.after(pageContent);
		var $pageContent = $this.next();		
		
		$.each( $this.data(),function(dataName, dataValue) {
			$pageContent.data(dataName, dataValue);
		});

		var apiName = $this.data('wp-apiname');

		$this.remove(); // remove in DOM but variable $this still has value, it is good enough, since it is now the end of the function

		if(apiName){
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
						parameters[api_params_in_Name] = default_params_value[api_params_in_Name];
					}else{
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

			getData(portal.url_api+apiName, 'POST', 'json', parameters, $pageContent, parseData);

			
		}// end if apiName
		
		
		
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

		parseBlockName();
		
	}else{
		console.log("something not right happened...");
		console.log("error code: "+response.wpCode);
		console.log("error message: "+response.wpMessage);

		alert("error code: "+response.wpCode+", error message: "+response.wpMessage);
		window.location = "error.html";
	}
	
};// end registerNewDevice

function parseBlockName(){
		$(document).find('[data-wp-blockname]').each(function(){
			$this = $(this);
			
			var blockName = $this.data('wp-blockname');
			console.log('now get: '+blockName);
			console.log('portal.url_pages: '+portal.url_pages);
			
			getData(portal.url_pages+blockName, 'GET', 'html', null, $this, parseApiName);
		});
}// end parseBlockName

function checkLocalStorage(){
	if(!Modernizr.localstorage){
		window.location = "not_supported.html";
	}
};

function parseDocument(){
	
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
		parameters.drid = drid;
		parameters.userDevice = checkDevice();

		getData(portal.url_api+'registerNewDevice', 'POST', 'json', parameters, drid, registerNewDevice);
		
	}else{
		parseBlockName();
	}// end pdid drid null

};

