var portal = {
	api: 'http://localhost:8080/json/',
	uri_scripts: 'portal/js/',
	uri_styles: 'portal/css/',
	ver: '800-000-1616.95.20150622',
	portalId: 'paveels',
	pageId: ''
};

function getParameter(name) {
	var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
		regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function callApi(apiName, default_params_value){
	console.log('callApi called...');

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
				parameters[api_params_in_Name] = wp[api_params_in_Name];

			}
		}else{
			parameters[api_params_in_Name] = valueFromRequest;
		}
		index_params_in++;
	}// end while setting field parameters

	getData(apiName, parameters, function(data){
		if (data.wpCode === "999") {
			
			var field_name = api_params[data.apiName]['params_out']['field_name'];
			api_params[data.apiName]['params_out']['field_data'] = data[field_name];

			if(data[field_name].length < 1){
				$('[data-api-name="'+apiName+'"]').remove();
			}else{
				fillResultToHtml(data.apiName);
			}

		} else {
			console.log('%c Error when requesting to "' + apiName+ '". ' + 'Please check your parameters or connection. ', dev.log.error);

			//FIXME keluarin notifikasi kalau ada error dari belakang
			console.log("apiName: "+apiName+", "+data.wpCode+": "+data.wpMessage);

			$('[data-api-name="'+apiName+'"]').remove();
		}// end else if 999
		
	});// end getData

	console.log('callApi finished...');
}// end callApi

function fillResultToHtml(apiName){

	//actually not all fields are needed, but still initiated for the sake of simplicity
	var field_name 		=  api_params[apiName]['params_out']['field_name'];
	var field_type 		=  api_params[apiName]['params_out']['field_type'];
	var field_parent 	=  api_params[apiName]['params_out']['field_parent'];
	var field_key 		=  api_params[apiName]['params_out']['field_key'];
	var field_data 		= api_params[apiName]['params_out']['field_data'];


	var $apiElements = $('#'+portal.pageId).find('[data-api-name="'+apiName+'"]');

	var indexElement = 0;

	$($apiElements).each(function(){
		var $thisApiElement = $(this);

		// $thisApiElement.data('api-load','false');

		var $apiLoops = $thisApiElement.find('[data-api-loop]');

		var indexLoop = 0;
		$($apiLoops).each(function(){
			$thisApiLoop = $(this);
			var apiLoop = $thisApiLoop.data('api-loop');

			if(apiLoop == "one"){

				var $apiFields = $thisApiElement.find('[data-api-field]');

				$($apiFields).each(function(){
					var $thisApiField = $(this);
					var fieldNameInElement = $thisApiField.data('api-field');

					if($thisApiField.prop("tagName") == "IMG"){
						$thisApiField.attr("src", field_data[fieldNameInElement]);
					}
					else if($thisApiField.prop("tagName") == "A"){
						var apiLink = $thisApiField.data('api-link');
						var hrefNew = $thisApiField.data('api-href');

						if(apiLink === "dynamic"){
							hrefNew = field_data[hrefNew];
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
					}
					else if($thisApiField.prop("tagName") == "INPUT"){
						$thisApiField.attr("value", field_data[fieldNameInElement]);
					}else{
						if(field_data[fieldNameInElement])
							$thisApiField.text(field_data[fieldNameInElement]);
					} //end else if
				});// end apiField.each

			};// end apiShow == one


			if(apiLoop == "list"){
				var $apiRecords = $thisApiLoop.find('[data-api-record="record"]');
				var indexApiRecord = 0;

				$($apiRecords).each(function(){

					$thisApiRecord = $(this);
					for (var indexRecord=0; indexRecord < field_data.length; indexRecord++){

						var $apiFields = $thisApiRecord.find('[data-api-field]');

						$($apiFields).each(function(){
							var $thisApiField = $(this);
							var fieldNameInElement = $thisApiField.data('api-field');

							if($thisApiField.prop("tagName") == "IMG"){
								$thisApiField.attr("src", field_data[indexRecord][fieldNameInElement]);
							}
							else if($thisApiField.prop("tagName") == "A"){
								var apiLink = $thisApiField.data('api-link');
								var hrefNew = $thisApiField.data('api-href');

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

						$thisApiLoop.append($thisApiRecord.clone().attr('id',apiName+'_'+indexElement+'_'+indexApiRecord+'_'+indexRecord));

					};// end for indexRecord
					$thisApiRecord.first().remove();

					indexApiRecord++;
				});// end apiRecords.each
			};// end apiLoop == list

			if(apiLoop == "parent-array"){
				var $apiParentRecords = $thisApiLoop.find('[data-api-record="parent"]');
				var indexApiParentRecord = 0;

				var parent_data = $.grep(field_data, function(e){
					return e[field_parent] == null;
				});

				$($apiParentRecords).each(function(){
					var $thisApiParentRecord = $(this);

					var $thisApiParentRecordClone = $thisApiParentRecord.clone();

					for (var indexParentRecord=0; indexParentRecord < parent_data.length; indexParentRecord++){

						var $apiParentFields = $thisApiParentRecord.find('[data-api-field]');
						$($apiParentFields).each(function(){
							var $thisApiParentField = $(this);
							var fieldNameInElement = $thisApiParentField.data('api-field');
							if($thisApiParentField.prop("tagName") == "IMG"){
								$thisApiParentField.attr("src", parent_data[indexParentRecord][fieldNameInElement]);
							}
							else if($thisApiParentField.prop("tagName") == "A"){
								var apiLink = $thisApiParentField.data('api-link');
								var hrefNew = $thisApiParentField.data('api-href');

								if(apiLink === "dynamic"){
									hrefNew = parent_data[indexParentRecord][hrefNew];
								}

								hrefNew = hrefNew + "?";

								// var hrefNew = $thisApiParentField.data('api-href')+"?";

								var fieldLinks = fieldNameInElement.split(',');

								var indexFieldLink = 0;
								while(indexFieldLink < fieldLinks.length){
									var fieldLinkName = fieldLinks[indexFieldLink];
									hrefNew = hrefNew+fieldLinkName+"="+parent_data[indexParentRecord][fieldLinkName]+"&";
									indexFieldLink++;
								}// end while indexFieldLink
								hrefNew = hrefNew.substring(0, (hrefNew.length-1) );
								$thisApiParentField.attr("href", hrefNew);
							}else{
								if(parent_data[indexParentRecord][fieldNameInElement])
									$thisApiParentField.text(parent_data[indexParentRecord][fieldNameInElement]);
							} //end else if

						})// end apiParentFields.each

						$thisApiParentRecord.attr('data-api-parent',parent_data[indexParentRecord][field_key]);


						$thisApiLoop.append($thisApiParentRecord.clone().attr('id',apiName+'_'+indexElement+'_'+indexApiParentRecord+'_'+indexParentRecord));


					}// end for indexParentRecord

					$thisApiParentRecord.first().remove();

					// $thisApiLoop.append($thisApiParentRecordClone);

					indexApiParentRecord++;
				});// end apiParentRecords.each

				for(var indexParentRecord=0; indexParentRecord < parent_data.length; indexParentRecord++){
					var parentId = parent_data[indexParentRecord][field_key];

					var $parentElements = $thisApiLoop.find('[data-api-parent="'+parentId+'"]');

					$($parentElements).each(function(){
						var $thisParentElement = $(this);

						var $thisChildrenArray = $thisParentElement.find('[data-api-loop="children-array"]');

						$($thisChildrenArray).each(function(){

							var $thisApiChildrenRecord = $thisChildrenArray.find('[data-api-record="children"]');
							// var $thisApiChildrenRecordClone = $thisApiChildrenRecord.clone();

							$($thisApiChildrenRecord).each(function(){
								var children_data = $.grep(field_data, function(e){
									return e[field_parent] == parent_data[indexParentRecord][field_key];
								});

								for(var indexChildrenRecord=0; indexChildrenRecord < children_data.length; indexChildrenRecord++){

									var $apiChildrenFields = $thisApiChildrenRecord.find('[data-api-field]');
									$($apiChildrenFields).each(function(){
										var $thisApiChildrenField = $(this);
										var fieldNameInElement = $thisApiChildrenField.data('api-field');
										if($thisApiChildrenField.prop("tagName") == "IMG"){
											$thisApiChildrenField.attr("src", children_data[indexChildrenRecord][fieldNameInElement]);
										}
										else if($thisApiChildrenField.prop("tagName") == "A"){
											var apiLink = $thisApiChildrenField.data('api-link');
											var hrefNew = $thisApiChildrenField.data('api-href');

											if(apiLink === "dynamic"){
												hrefNew = children_data[indexChildrenRecord][hrefNew];
											}

											hrefNew = hrefNew + "?";

											// var hrefNew = $thisApiChildrenField.data('api-href')+"?";
											var fieldLinks = fieldNameInElement.split(',');

											var indexFieldLink = 0;
											while(indexFieldLink < fieldLinks.length){
												var fieldLinkName = fieldLinks[indexFieldLink];
												hrefNew = hrefNew+fieldLinkName+"="+children_data[indexChildrenRecord][fieldLinkName]+"&";
												indexFieldLink++;
											}// end while indexFieldLink
											hrefNew = hrefNew.substring(0, (hrefNew.length-1) );
											$thisApiChildrenField.attr("href", hrefNew);



										}else{
											if(children_data[indexChildrenRecord][fieldNameInElement])
												$thisApiChildrenField.text(children_data[indexChildrenRecord][fieldNameInElement]);
										} //end else if

									})// end apiChildrenFields.each

									$thisChildrenArray.append($thisApiChildrenRecord.clone().attr('id',apiName+'_'+indexElement+'_'+'_'+indexChildrenRecord));

								}// end for indexChildrenRecord

								$thisChildrenArray.children().first().remove();

							});// end thisApiChildrenRecord.each

						})// end thisChildrenArray.each

					});// end parentElement.each

				}// end for indexParentRecord

			};// end apiLoop == array

			indexLoop++;
		});// end apiLoop.each

		indexElement++;
	});// end apiElements.each

}// end fillResultToHtml

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

function acak(min, max, whole) {
	console.log("acak called...");
	return void 0===whole||!1===whole?Math.random()*(max-min+1)+min:!isNaN(parseFloat(whole))&&0<=parseFloat(whole)&&20>=parseFloat(whole)?(Math.random()*(max-min+1)+min).toFixed(whole):Math.floor(Math.random()*(max-min+1))+min;
};

function registerNewDevice(ver, drid, callback){
	console.log("registerNewDevice called...");
	var jawaban = false;

	$.ajax({
		url: portal.api+"registerNewDevice",
		data: {
			ver: ver,
			drid: drid,
			userDevice: checkDevice()
		},
		type: "POST",
		cache: false,
		dataType: 'json',

		success: function(response, status, xhr) {
			console.log("registerNewDevice responded...");

			if (response.wpCode === 999) {
				console.log("now writing to local storage");

				localStorage.setItem("pdid",response.pdid);
				localStorage.setItem("drid",drid);

				if (typeof(callback) == "function") {
					callback();
				}

			}else{
				console.log("something not right happened...");
				console.log("error code: "+response.wpCode);
				console.log("error message: "+response.wpMessage);

				alert("error code: "+response.wpCode+", error message: "+response.wpMessage);
				// window.location = "error.html";
			}

		},
		error: function(xhr, status, error) {
			console.log("error in contacting registerNewDevice...");
			console.log(xhr, status, error);
			//window.location = "error.html";
		}
	});
}; // end registerNewDevice



function parsePage(){
	//FIXME sesuaikan dengan yg normal, karena gak pake jqm lagi
	portal.pageId = $('body').pagecontainer('getActivePage').prop('id');

	var $pageNow = $('#'+portal.pageId);
	var apis = $pageNow.data('api-name');

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
	if(!Modernizr.localstorage){
		window.location = "not_supported.html";
	}

	console.log("portal.api: "+portal.api);
	console.log("portal.ver: "+portal.ver);

	var pdid = localStorage["pdid"];
	console.log("pdid: "+pdid);

	var drid = localStorage["drid"];
	console.log("drid: "+drid);

	if(pdid == null || drid == null){
		console.log("pdid or drid is null, now trying to get pdid from backend");
		drid = acak(1,100000000000,0);
		registerNewDevice(portal.ver, drid, function(){
			parsePage();
		});
	}else{
		parsePage();
	}// end pdid drid null

	//FIXME TESTING KALAU SUDAH DI WEB SERVER, apakah masih bener perhitungan index titiknya
	var pathname = window.location.pathname
	// alert("window.location.pathname: "+pathname);
	var titikHtml = pathname.lastIndexOf(".html");
	// alert("titikHtml: "+titikHtml);
	var garisMiring = pathname.lastIndexOf("/");
	
	pathname = pathname.substring(garisMiring+1, titikHtml);
	// alert("pathname now: "+pathname);
	
	loadJsCssFile(portal.uri_scripts+pathname+".js", "js");

	
	
	
	$('[data-api-type="form"]').on("submit", function(e){
		// FIXME submit button harusnya diTOGGLE!!! biar gak diclick 2x
		e.preventDefault();
		
		// FIXME harusnya ada validasi dulu
		
		var $this = $(this);
		var apiName = $this.attr('action');
		
		if(apiName){
			console.log("action: "+apiName);

			var parameters = {};

			$($this).find('input, textarea, select').each(function(i, field) {

			    console.log("field.type: "+field.type);
			    
				if (field.type == "radio" || field.type == "checkbox")
	                parameters[field.name] = $(field).attr("checked");
	            else
				    parameters[field.name] = field.value;
				
			});// end $this find input
			
			parameters.pdid = localStorage['pdid'];
			parameters.drid = localStorage['drid'];
			parameters.dtk = localStorage['dtk'];

			getData(apiName, parameters, function(data){
				if(data.wpCode === "999") {
					var nextPage = $this.data('api-nextpage');
					if(nextPage){
						console.log('ada nextpagenya: '+nextPage);
					}else{
						// FIXME keluarin notifikasi aja biar berasa
						console.log('no nextpage');
					}// end nextPage
				}else{
					// FIXME buat error handling
					console.log('wpCode: '+data.wpCode+', wpMessage: '+data.wpMessage);
					
				}// end if wpCode 999	
			});// end getData
		};// end if apiName

	});// end onsubmit
		
	$('[data-api-type="button"]').on("click", function(){
		// FIXME button harusnya diTOGGLE!!! biar gak diclick 2x
		
		var $this = $(this);
		var apiName = $this.data('api-action');
		
		if(apiName){
			console.log("action: "+apiName);

			var parameters = {};
			parameters.pdid = localStorage['pdid'];
			parameters.drid = localStorage['drid'];
			parameters.dtk = localStorage['dtk'];

			getData(apiName, parameters, function(data){
				if(data.wpCode === "999") {
					var nextPage = $this.data('api-nextpage');
					if(nextPage){
						console.log('ada nextpagenya: '+nextPage);
					}else{
						// FIXME keluarin notifikasi aja biar berasa
						console.log('no nextpage');
					}// end nextPage
				}else{
					// FIXME buat error handling
					console.log('wpCode: '+data.wpCode+', wpMessage: '+data.wpMessage);
					
				}// end if wpCode 999	
			});// end getData
		};// end if apiName
	});// end onclick
		
}); // end $(function(){

