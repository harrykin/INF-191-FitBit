import document from "document";
import * as messaging from "messaging";

// import * as activity from "activity";
import * as fitClock from "./fitClock.js";
import * as HRM from "./hrm.js";

let background = document.getElementById("background");
let dividers = document.getElementsByClassName("divider");
let txtTime = document.getElementById("txtTime");
// let txtDate = document.getElementById("txtDate");
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");

let hrCounter = 0;
let fitbitID = 1;


// DEBUG Start
let onButton = document.getElementById("on-button");
let offButton = document.getElementById("off-button");
let fidButton1 = document.getElementById("fid-1");
let fidButton2 = document.getElementById("fid-2");
let fidButton3 = document.getElementById("fid-3");

fidButton1.onclick = function(evt) {
  fitbitID = 1;
};
fidButton2.onclick = function(evt) {
  fitbitID = 2;
};
fidButton3.onclick = function(evt) {
  fitbitID = 3;
};
// DEBUG Stop


function sendHeartRate(bpm) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      "heartrate": bpm,
      "fid": fitbitID,
      "time": Date.now()
    });
  }
  else {
    console.log("Error sending Heart Rate Data");
  }
}

function printHeartRate(bpm) {
  console.log(JSON.stringify(
    {
      "heartrate": bpm,
      "fid": fitbitID,
      "time": Date.now()
    }));
}

function clockCallback(data) {
  txtTime.text = data.time;
}
fitClock.initialize("minutes", clockCallback);


function hrmCallback(data) {
  hrCounter++;
  if (hrCounter % 5 == 0){
    // sendHeartRate(data.bpm);
    printHeartRate(data.bpm);
  }
  txtHRM.text = `${data.bpm}`;
  if (data.zone === "out-of-range") {
    imgHRM.href = "images/heart_open.png";
  } else {
    imgHRM.href = "images/heart_solid.png";
  }
  if (data.bpm !== "--") {
    iconHRM.animate("highlight");
  }
}
HRM.initialize(hrmCallback);
