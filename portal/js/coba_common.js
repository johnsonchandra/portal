var portal = {
	url_api: 'http://localhost:8080/json/',
	url_scripts: 'portal/js/',
	url_styles: 'portal/css/',
	url_widgets: 'portal/widgets/',
//	url_widgets: 'http://localhost:8080/pages/',
	ver: '800-000-1616.95.20150622',
};

function getParameter(name) {
	var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
		regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function acak(min, max, whole) {
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
		console.log('Error when requesting to "' + requestUrl + '" ');
		callback($this, null);
	})
}// end getPage


function parseDataField($thisApiField, field_mapping, field_data){
	var fieldMappingElement = field_mapping[$thisApiField.data('wp-widget')];
	console.log("fieldMappingElement: "+fieldMappingElement);
	
	if($thisApiField.prop("tagName") == "A"){
		var hrefNew = fieldMappingElement['href'];
		
		console.log("hrefNew before: "+hrefNew);
		
		if(hrefNew){
			hrefNew = field_data[fieldMappingElement['href']];
		}else{
			hrefNew = $thisApiField.attr('href'); //FIXME kalau static disini jadi berulang terus
		}
		console.log("hrefNew after: "+hrefNew);

		hrefNew = hrefNew + "?";
		
		var wpHrefParams = fieldMappingElement['href_params'];
		console.log("wpHrefParams: "+wpHrefParams);
		if(wpHrefParams){
			var fieldLinks = wpHrefParams.split(',');
			if(fieldLinks){
				var indexFieldLink = 0;
				while(indexFieldLink < fieldLinks.length){
					var fieldLinkName = fieldLinks[indexFieldLink].trim();
					hrefNew = hrefNew+fieldLinkName+"="+field_data[fieldLinkName]+"&";
					indexFieldLink++;
				}// end while indexFieldLink
			}
		}
		
		hrefNew = hrefNew.substring(0, (hrefNew.length-1) );

//		console.log("hrefNew after loop: "+hrefNew);
		var textLink = field_data[fieldMappingElement['text']];
		if(textLink)
			$thisApiField.text(field_data[fieldMappingElement['text']]);
		$thisApiField.attr("href", hrefNew);
	}else{
		for(var fieldMappingElementAttr in fieldMappingElement){
			if(fieldMappingElementAttr === "text"){
				$thisApiField.text(field_data[fieldMappingElement[fieldMappingElementAttr]]);
			}else{
				$thisApiField.attr(fieldMappingElementAttr, field_data[fieldMappingElement[fieldMappingElementAttr]]);
			}
		}// end for
	}// end if A
}// end parseDataField


function parseRecord($thisApiRecord, indexLoop, indexApiRecord, apiName, field_mapping, field_data){
	console.log("di dalam parseRecord");

	if(field_data.length){
		for (var indexRecord=0; indexRecord < field_data.length; indexRecord++){
			var $apiFields = $thisApiRecord.find('[data-wp-widget]');

			$($apiFields).each(function(){
				parseDataField($(this), field_mapping, field_data[indexRecord]);
			});// end apiField.each

			$thisApiLoop.append($thisApiRecord.clone());
			
//			use below line if you want to implement attribute id
//			$thisApiLoop.append($thisApiRecord.clone().attr('id',apiName+'_'+indexLoop+'_'+indexApiRecord+'_'+indexRecord));
			

		};// end for indexRecord
		$thisApiRecord.first().remove();
	}else{
		var $apiFields = $thisApiRecord.find('[data-wp-widget]');

		$($apiFields).each(function(){
			parseDataField($(this), field_mapping, field_data);
		});// end apiField.each
	}

}// end parseRecord




function parseData($this, data){	
	if(data){
		if(data.wpCode === "999") {
//			$.each( $this.data(),function(i, e) {
//				console.log('name='+ i + ' value=' +e);
//			});
			
			var widgetParams = $this.data('wp-widget');
			var apiName = widgetParams['api_name'];
			var field_name 	= widgetParams['api_params_out']['field_name'];
			var field_data 	= data[field_name];
			var field_mapping = widgetParams['field_mapping'];

			var $apiLoops = $this.find('[data-wp-loop]');			

			var indexLoop = 0;
			$($apiLoops).each(function(){
				$thisApiLoop = $(this);
				var $apiRecords = $this.find('[data-wp-record="record"]');
				var indexApiRecord = 0;

				$($apiRecords).each(function(){
					parseRecord($(this), indexLoop, indexApiRecord, apiName, field_mapping, field_data);
					indexApiRecord++;
				});// end apiRecords.each			
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
		
		var widgetParams = $this.data('wp-widget');
		
		var widgetTitle = widgetParams['title'];
		if(widgetTitle){
			$pageContent.find('[data-wp-widget="title"]').each(function(){
				$(this).text(widgetTitle);
			});			
		};
		
		$.each( $this.data(),function(dataName, dataValue) {
			$pageContent.data(dataName, dataValue);
		});

		var apiName = widgetParams['api_name'];
		
		$this.remove(); // remove in DOM but variable $this still has value, it is good enough, since it is now the end of the function

		if(apiName){			
			var api_params_in = widgetParams['api_params_in'];
			var paramEnforce = widgetParams['api_params_in']['enforce'];
			
			var parameters = {};
			parameters.pdid = localStorage['pdid'];
			parameters.drid = localStorage['drid'];
			parameters.dtk = localStorage['dtk'];
			
			for(var param_name in api_params_in) {
				if(paramEnforce == true){
					if(param_name != "enforce"){
						parameters[param_name] = api_params_in[param_name];
					}
				}else{
					var valueFromRequest = getParameter(param_name);
					if(valueFromRequest == "" ){
						if(paramName != "enforce")
							parameters[param_name] = api_params_in[param_name];
					}else{
						parameters[param_name] = valueFromRequest;
					}
				}				
			}// end for
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

		parseWidget();
		
	}else{
		console.log("something not right happened...");
		console.log("error code: "+response.wpCode);
		console.log("error message: "+response.wpMessage);

		alert("error code: "+response.wpCode+", error message: "+response.wpMessage);
		window.location = "error.html";
	}
	
};// end registerNewDevice

function parseWidget(){
	$(document).find('[data-wp-widget]').each(function(){
		$this = $(this);			
		var widgetParams = $this.data('wp-widget');
		getData(portal.url_widgets+widgetParams['URL'].trim(), 'GET', 'html', null, $this, parseApiName);
	});
}// end parseWidget

function checkLocalStorage(){
	if(!Modernizr.localstorage){
		window.location = "not_supported.html";
	}
};

//use this function with the tradeoff:
//disadvantage: call backend x times if same api is required x times
//advantage: not using variable to store the response data
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
		parseWidget();
	}// end pdid drid null

};

//use this function with the tradeoff:
//advantage: call backend 1 time although same api is required x times
//disadvantage: using variable to store the response data
//function parsePage(){
//	sesuaikan dengan yg normal, karena gak pake jqm lagi
//	portal.pageId = $('body').pagecontainer('getActivePage').prop('id');
//
//	var $pageNow = $('#'+portal.pageId);
//	var apis = $pageNow.data('api-name');
//
//	var apiNames = [];
//	if(apis)
//		apiNames = apis.split(',');
//
//	for (var indexApiName = 0; indexApiName < apiNames.length; indexApiName++) {
//	   var apiName = $.trim(apiNames[indexApiName]);
//	   var default_params_value = $pageNow.data( apiName.toLowerCase() ) ;
//	   console.log("apiName: "+apiName);
//	   callApi(apiName, default_params_value);
//	}// end for apiNames
//
//	$pageNow.removeAttr("data-api-name");
//	$pageNow.removeData("api-name");
//
//}; // end document on parsePage
