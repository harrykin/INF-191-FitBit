/*
  ==Device Initialization and Operations==
  Basic starting operations when first initializing device
  - 
*/

import * as messaging from "messaging";


var deviceID = "NA";  // 0 === unset

export function getDeviceID() {
  if ( deviceID === "NA" ){
    deviceID = makeUniqueID();
  }
  return deviceID;
}


function makeUniqueID() {
  var newID;
  // TODO setting a timeout period when requesting data from server?

  newID = 1;

  return newID;
}

