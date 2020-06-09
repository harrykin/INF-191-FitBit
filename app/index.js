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
let fitbitID1 = false;
let fitbitID2 = false;
let fitbitID3 = false;
let isSendingDataToServer = 0;


// DEBUG Start
let onButton = document.getElementById("on-button");
let offButton = document.getElementById("off-button");
let fidButton1 = document.getElementById("fid-1");
let fidButton2 = document.getElementById("fid-2");
let fidButton3 = document.getElementById("fid-3");

onButton.onclick = (evt) => isSendingDataToServer = true;
offButton.onclick = (evt) => isSendingDataToServer = false;

fidButton1.onclick = function(evt) {
  if (fitbitID1) {
    fitbitID1 = false;
    fidButton1.style.fill = "fb-red";
  } else {
    fitbitID1 = true;
    fidButton1.style.fill = "fb-green";
  }
};
fidButton2.onclick = function(evt) {
  if (fitbitID2) {
    fitbitID2 = false;
    fidButton2.style.fill = "fb-red";
  } else {
    fitbitID2 = true;
    fidButton2.style.fill = "fb-green";
  }
};
fidButton3.onclick = function(evt) {
  if (fitbitID3) {
    fitbitID3 = false;
    fidButton3.style.fill = "fb-red";
  } else {
    fitbitID3 = true;
    fidButton3.style.fill = "fb-green";
  }
};
// DEBUG Stop


function sendHeartRate(bpm) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    if (fitbitID3) messaging.peerSocket.send({
      "heartrate": bpm,
      "fid": 3,
      "time": Date.now()
    });
    if (fitbitID2) messaging.peerSocket.send({
      "heartrate": bpm+25,
      "fid": 2,
      "time": Date.now()
    });
    if (fitbitID1) messaging.peerSocket.send({
      "heartrate": bpm,
      "fid": 1,
      "time": Date.now()
    });
  }
  else {
    console.log("Error sending Heart Rate Data");
  }
}

function printHeartRate(bpm) {
  if (fitbitID3) console.log(JSON.stringify({
    "heartrate": bpm,
    "fid": 3,
    "time": Date.now()
  }));
  if (fitbitID2) console.log(JSON.stringify({
    "heartrate": bpm+30,
    "fid": 2,
    "time": Date.now()
  }));
  if (fitbitID1) console.log(JSON.stringify({
    "heartrate": bpm,
    "fid": 1,
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
    if (isSendingDataToServer){
      sendHeartRate(data.bpm);
    }
    else{
      printHeartRate(data.bpm);
    }
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
