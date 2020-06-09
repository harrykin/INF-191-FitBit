// fitbit SDK
import document from "document";
import { peerSocket } from "messaging";
import { battery } from "power";

// program files
import * as device from "./device.js";
import * as fitClock from "./fitClock.js";
import * as HRM from "./hrm.js";
import { logError } from "./errorLoggging.js";


/*
  Device initialization
*/
let deviceID = device.getDeviceID();
document.getElementById("deviceID").text = deviceID;


/*
  Connectivity
 */
let uiConnection = document.getElementById("connection");
let isConnected = (peerSocket.readyState === peerSocket.OPEN);

peerSocket.addEventListener( "close", () => {
  isConnected = false;
  uiConnection.href = "images/disconnected.png";
  logError("PEERSOCKET:CLOSED");
});
peerSocket.addEventListener( "open", () => {
  isConnected = true;
  uiConnection.href = "images/connected_1bar.png";
  console.log("PEERSOCKET:OPENED");
});

let connectionInterval = setInterval( () => {
  if (isConnected) {
    if (uiConnection.href === "images/connected_1bar.png"){
      uiConnection.href = "images/connected_2bar.png";
    } else if (uiConnection.href === "images/connected_2bar.png"){
      uiConnection.href = "images/connected_3bar.png";
    } else {
      uiConnection.href = "images/connected_1bar.png";
    }
  }
}, 1000);




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

