// fitbit SDK
import document from "document";
// import * as messaging from "messaging";
import { battery } from "power";

// program files
import * as device from "./device.js";
import * as fitClock from "./fitClock.js";
import * as HRM from "./hrm.js";


/*
  Device initialization
*/
var deviceID = device.getDeviceID();
document.getElementById("deviceID").text = deviceID;



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
let batteryLevel = document.getElementById("battery-percent");
batteryLevel.text = `${battery.chargeLevel}%`;

let batteryIcon = document.getElementById("icon-battery");
batteryIcon.href = selectBatteryIcon(battery.chargeLevel);

battery.addEventListener("change", () => {
  batteryLevel.text = `${battery.chargeLevel}%`;
  batteryIcon.href = selectBatteryIcon(battery.chargeLevel);
});

// returns appropriate Battery Icon
function selectBatteryIcon(percentage) {
  if ( percentage > 85 ) {
    return "images/battery_icon4.png";
  } else if ( percentage > 65 ) {
    return "images/battery_icon3.png";
  } else if ( percentage > 35 ) {
    return "images/battery_icon2.png";
  } else {
    return "images/battery_icon1.png";
  }
}



/*
  HEART RATE MONITOR
*/
// let hrCounter = 0;
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");

HRM.initialize(hrmCallback);
function hrmCallback(data) {
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

