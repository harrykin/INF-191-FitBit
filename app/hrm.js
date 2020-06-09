/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
// import { BodyPresenceSensor } from "body-presence";
import { peerSocket } from "messaging";

import * as device from "./device.js";

let hrmSensor;
let sensorRunning = false; // 
let uiHeartRateCallback;
// let bodypres;
// let lastReading;   // TODO replace in favor of body-presence?
let heartRate;
let heartRateCounter = 0;

let deviceID = device.getDeviceID();

let hrNotSentStorage = [];


export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    uiHeartRateCallback = callback;
    hrmSensor = new HeartRateSensor({ frequency: 1 });
    // bodypres = new BodyPresenceSensor();
    // setupEvents();
    start();
    // lastReading = hrmSensor.timestamp;
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
    callback({
      bpm: "???",
      zone: "denied",
      restingHeartRate: "???"
    });
  }
}

// TODO replace time stamp usage -> unreliable
function getReading() {
  heartRate = hrmSensor.heartRate;
  heartRateCounter++;
  if ( heartRateCounter >= 5 ){
    sendHeartRate(heartRate);
    heartRateCounter = 0;
  }
  uiHeartRateCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrmSensor.heartRate || 0),
    restingHeartRate: user.restingHeartRate
  });
}

// TODO -> deactivate device when off person
// function setupEvents() {
//   // bodypres.addEventListener("");
//   // bodypres.start();
// }

function start() {
  if (!sensorRunning) {
    hrmSensor.addEventListener( "reading", getReading );
    hrmSensor.start();
    sensorRunning = true;
  }
}

function stop() {
  if (sensorRunning) {
    hrmSensor.removeEventListener( "reading", getReading );
    hrmSensor.stop();
    sensorRunning = false;
  }
}



// Communication function
function sendHeartRate(bpm) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    let sendData = peerSocket.send;
    // let sendData = (data) => console.log(JSON.stringify(data));
    try {
      sendData({
        "heartrate": bpm,
        "fid": deviceID,
        "time": Date.now()
      });
    } catch(err) {
      console.log("ERROR:SENDING DATA");
    }
  }
  else {
    console.log("Couldn't Send");
    hrNotSentStorage.push({
      "heartrate": bpm,
      "fid": deviceID,
      "time": Date.now()
    });
    // console.log("Error sending Heart Rate Data: SAVING");
    // TODO check connectivity
    // TODO store to temporary storage
  }
}

// Debugging function: NA
function printHeartRate(bpm){
  console.log(JSON.stringify({
    "heartrate": bpm,
    "fid": deviceID,
    "time": Date.now()
  }));
}

