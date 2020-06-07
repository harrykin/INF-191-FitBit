// fitbit SDK
import document from "document";
import * as messaging from "messaging";
import { battery } from "power";

// program files
import * as device from "./device.js";
import * as fitClock from "./fitClock.js";
import * as HRM from "./hrm.js";


/*
  Device initialization
*/
var fitbitID = device.getDeviceID();
document.getElementById("deviceID").text = fitbitID;



/*
  CLOCK UI
*/
let txtTime = document.getElementById("txtTime");
let txtTimeAmPm = document.getElementById("txtTimeAmPm");

function clockCallback(data) {
  txtTime.text = data.time;
  txtTimeAmPm.text = data.ampm;
}
fitClock.initialize("minutes", clockCallback);



/*
  BATTERY UI
*/




/*
  HEART RATE MONITOR
*/
let hrCounter = 0;
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");

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

