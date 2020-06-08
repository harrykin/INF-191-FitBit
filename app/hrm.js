/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
// import { BodyPresenceSensor } from "body-presence";
import * as messaging from "messaging";

import * as device from "./device.js";

let hrmSensor;
let sensorRunning; // 
let uiHeartRateCallback;
// let bodypres;
let lastReading;   // TODO replace in favor of body-presence?
let heartRate;

let deviceID = device.getDeviceID();


export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    uiHeartRateCallback = callback;
    hrmSensor = new HeartRateSensor();
    // bodypres = new BodyPresenceSensor();
    // setupEvents();
    start();
    lastReading = hrmSensor.timestamp;
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
  if (hrmSensor.timestamp !== lastReading) {
    heartRate = hrmSensor.heartRate;
  }
  lastReading = hrmSensor.timestamp;
  // sendHeartRate(heartRate);
  printHeartRate(heartRate);
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
    hrmSensor.start();
    getReading();
    sensorRunning = setInterval(getReading, 1000);
    // TODO creating own events -> should use HRM's inbuild event?
  }
}

function stop() {
  if (sensorRunning) {
    hrmSensor.stop();
    clearInterval(sensorRunning);
    sensorRunning = null;
  }
}



// Communication functions
function sendHeartRate(bpm) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      "heartrate": bpm,
      "fid": deviceID,
      "time": Date.now()
    });
  }
  else {
    console.log("Error sending Heart Rate Data");
    // TODO check connectivity
    // TODO store to temporary storage
  }
}

function printHeartRate(bpm) {
  console.log(JSON.stringify({
    "heartrate": bpm,
    "fid": deviceID,
    "time": Date.now()
  }));
}

