import document from "document";

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
// let statsCycle = document.getElementById("stats-cycle");
// let statsCycleItems = statsCycle.getElementsByClassName("cycle-item");
let onButton = document.getElementById("on-button");
let offButton = document.getElementById("off-button");
let fidButton1 = document.getElementById("fid-1");
let fidButton2 = document.getElementById("fid-2");
let fidButton3 = document.getElementById("fid-3");

// temporary
// onButton.addEventListener("activate", function(evt) { console.log("ON"); } );
onButton.onactivate = function(evt) {
  console.log("ON");
}

offButton.onactivate = function(evt) {
  console.log("OFF");
}



function clockCallback(data) {
  txtTime.text = data.time;
}
fitClock.initialize("minutes", clockCallback);


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
HRM.initialize(hrmCallback);
