import { peerSocket } from "messaging";
// import * as settings from "./companion-settings.js";
// settings.initialize();

import { LACHESIS_API } from "../common/globals.js";


function onOpen(evt) {
  console.log("CONNECTED");
}

function onError(evt) {
  console.log("ERROR: ${evt.data}");
}

function sendHeartRate(data) {
  // console.log("Sending Heart Rate by http");
  fetch( LACHESIS_API,
         {method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)})
    .then((response) => {return response.json();})
    .then((data) => {console.log("Data sent: " + data);});
}

// Debugging
function printHeartRate(data) {
  console.log(JSON.stringify(data));
}

// when "message" recieved from FitBit device
peerSocket.onmessage = function(event) {
  if(event.data) {
    sendHeartRate(event.data);
    // printHeartRate(event.data);
  }
};
