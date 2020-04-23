/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";

import * as messaging from "messaging";

let hrm, watchID, hrmCallback;
let lastReading = 0;
let heartRate;
// let heartRate_Time = {};
let hrCounter = 0;

export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();
    setupEvents(); // subscribed HR monitor to the display -> should deactivate that
    start();
    lastReading = hrm.timestamp;
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
    callback({
      bpm: "???",
      zone: "denied",
      restingHeartRate: "???"
    });
  }
}

function sendHeartRate(heartRate) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      HeartRate: heartRate
    });
  }
    else {
        console.log("Error sending Heart Rate Data");
    }
}

function getReading() {
  if (hrm.timestamp === lastReading) {
    heartRate = "--";
  } else {
    heartRate = hrm.heartRate;
    hrCounter++;
    // heartRate_Time[hrm.timestamp] = heartRate;
  }
  lastReading = hrm.timestamp;
  if (hrCounter % 5 == 0){
    sendHeartRate(
      {
        "fid":1,
        "heartrate":heartRate,
        "time": Date.now()
      });
    // heartRate_Time = {};
  }
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
    restingHeartRate: user.restingHeartRate
  });
}

function setupEvents() {
  display.addEventListener("change", function() {
    if (display.on) {
      start();
    } else {
      stop();
    }
  });
}

function start() {
  if (!watchID) {
    hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

function stop() {
  hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
