var request         = require('request');

var gitterHost    = process.env.HOST || 'https://gitter.im';

var fs= require('fs');

// TOKEN
var token = "ENTER YOUR TOKEN";


function makeOptions(beforeId) {
  var options = {

     // ROOM ID
     url: gitterHost + "/api/v1/rooms/ENTER ROOMID/chatMessages?limit=100"+ 
     (beforeId ? "&beforeId=" + beforeId :""),
     headers: {
       'Authorization': 'Bearer ' + token
     }
  };
  return options;
};

var beforeId = null;
var messages = [];

function makeRequest() {
  
    request(makeOptions(beforeId), function(err, res, body) {
    if (err){
      console.log(err)
      return console.log("You have a request problem")

    }else {
      var newMessages = JSON.parse(body);
      beforeId = (newMessages[0] || {}).id;
      messages = messages.concat(newMessages.reverse());

      console.log('beforeId: ', beforeId);
      if (newMessages.length < 100) {
        console.log("message is finished", messages.length)
        fs.writeFileSync('result.json',JSON.stringify(messages,null,2));
      } else {
        console.log('settings timeout');
        setTimeout(() => {
          console.log('making request');
          makeRequest();
        }, 100);
      }
    };
  });
};



console.log('making first request');
makeRequest();
