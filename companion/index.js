import * as settings from "./companion-settings.js";

settings.initialize();

import * as messaging from "messaging";

let lachesisAPI = "https://lachesisfitbit.com/api/inputFitbitByJSON";

function onOpen(evt) {
  console.log("CONNECTED");
}

function onError(evt) {
  console.log("ERROR: ${evt.data}");
}

function sendHeartRate(data) {
  console.log("Sending Heart Rate by http");
  fetch(lachesisAPI,
        {method: "POST",
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)})
    .then((response) => {return response.json();})
    .then((data) => {console.log(data);});
}

function printHeartRate(data) {
  console.log("Printing HR data...");
  console.log(JSON.stringify(data));
}

// when "message" recieved from FitBit device
messaging.peerSocket.onmessage = function(event) {
  if(event.data) {
    sendHeartRate(event.data.HeartRate);
    // printHeartRate(event.data.HeartRate);
  }
}
