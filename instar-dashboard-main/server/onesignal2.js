var sendNotification = function (data) {
    var headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic MzA3NWQ2N2ItYzgzYS00M2EwLWExNWMtMWJlZjZiNWRhNzcy', // Replace with your OneSignal REST API Key
    };
  
    var options = {
      host: 'onesignal.com',
      port: 443,
      path: '/api/v1/notifications',
      method: 'POST',
      headers: headers,
    };
  
    var https = require('https');
    var req = https.request(options, function (res) {
      var responseData = '';
  
      res.on('data', function (chunk) {
        responseData += chunk;
      });
  
      res.on('end', function () {
        console.log('Response:');
        console.log(JSON.parse(responseData));
      });
    });
  
    req.on('error', function (e) {
      console.log('ERROR:');
      console.log(e);
    });
  
    req.write(JSON.stringify(data)); // Send the data as JSON in the request body
    req.end();
  };
  
  var message = {
    app_id: 'a3169b3f-c11f-44a6-9ccb-91db64a6020d', // Replace with your OneSignal App ID
    contents: { en: 'English Message' },
    included_segments: ['Subscribed Users'],
  };
  
  sendNotification(message);
  