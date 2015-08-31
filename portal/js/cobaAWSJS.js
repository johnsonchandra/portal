// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:b224255c-d08c-4532-b2d1-ff9cf734eaa6',
});


//Initialize the Cognito Sync client

AWS.config.credentials.get(function(){

   var syncClient = new AWS.CognitoSyncManager();

   syncClient.openOrCreateDataset('datasetPertama', function(err, dataset) {

      dataset.put('kunciPertama', 'valuePertamaTimpa', function(err, record){

         dataset.synchronize({

            onSuccess: function(data, newRecords) {
                // Your handler code here
            	console.log('berhasil');
            }

         });

      });
     
   });

});