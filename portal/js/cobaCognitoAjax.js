// The parameters required to intialize the Cognito Credentials object.
// If you are authenticating your users through one of the supported
// identity providers you should set the Logins object with the provider
// tokens. For example:
// Logins: {
//   graph.facebook.com : facebookResponse.authResponse.accessToken
// }
var params = {
    IdentityPoolId: "us-east-1:b224255c-d08c-4532-b2d1-ff9cf734eaa6"
};
 
// set the Amazon Cognito region
AWS.config.region = 'us-east-1';

//set the default config object
var creds = new AWS.CognitoIdentityCredentials(params);
AWS.config.credentials = creds;

// We can set the get method of the Credentials object to retrieve
// the unique identifier for the end user (identityId) once the provider
// has refreshed itself
//AWS.config.credentials.get(function(err) {
//    if (err) {
//        console.log("Error: "+err);
//        return;
//    }
//    console.log("Cognito Identity Id: " + AWS.config.credentials.identityId);
// 
//    // Other service clients will automatically use the Cognito Credentials provider
//    // configured in the JavaScript SDK.
//    var cognitoSyncClient = new AWS.CognitoSync();
//    cognitoSyncClient.listDatasets({
//        IdentityId: AWS.config.credentials.identityId,
//        IdentityPoolId: "us-east-1:b224255c-d08c-4532-b2d1-ff9cf734eaa6"
//    }, function(err, data) {
//        if ( !err ) {
//            console.log(JSON.stringify(data));
//        }
//    });
//});


//Called when an identity provider (providerName) has a token
//for a logged in user.
function userLoggedIn(providerName, token) {
	creds.params.Logins = {};
	creds.params.Logins[providerName] = token;

	// finally, expire the credentials so we refresh on the next request
	creds.expired = true;
	console.log("sudah dibuat expired");
}

//
//var s3 = new AWS.S3({region: 'us-east-1'});
//s3.listObjects({Bucket: 'jcha'}, function(err, data) {
//    if (err) console.log(err);
//    else console.log(data);
//});
//
