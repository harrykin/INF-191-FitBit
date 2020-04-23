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
  // console.log(data);
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

// when "message" recieved from FitBit device
messaging.peerSocket.onmessage = function(event) {
  // console.log("Data recieved from app");
  if(event.data) {
    sendHeartRate(event.data.HeartRate);
  }
}
