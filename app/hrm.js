/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
// import { BodyPresenceSensor } from "body-presence";

import * as messaging from "messaging";

let hrm, watchID, hrmCallback, bodypres;
let lastReading = 0;
let heartRate;

export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();
    // bodypres = new BodyPresenceSensor();
    setupEvents();
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

function getReading() {
  if (hrm.timestamp !== lastReading) {
    heartRate = hrm.heartRate;
  }
  lastReading = hrm.timestamp;
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
    restingHeartRate: user.restingHeartRate
  });
}

// TODO -> deactivate device when off person
function setupEvents() {
  // bodypres.addEventListener("");
  // bodypres.start();
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
