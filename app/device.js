/*
  ==Device Initialization and Operations==
  Basic starting operations when first initializing device
  - 
*/

import { peerSocket } from "messaging";
import { readFileSync } from "fs";

import { MANUAL_DEVICE_ID } from "../common/globals.js";
import { logError } from "./errorLoggging.js";


let deviceID;  // 0 === unset

export function getDeviceID() {
  if ( !deviceID ){
    deviceID = makeUniqueID();
  }
  return deviceID;
}


function makeUniqueID() {
  let newID;
  // TODO setting a timeout period when requesting data from server?
  // newID = getIDFromFile("fitbitID.json");
  // newID = getIDFromServer();
  newID = MANUAL_DEVICE_ID;

  return newID;
}


function getIDFromFile(fileName="fitbitID.json"){
  let newID = 0;
  try{
    newID = readFileSync(fileName, "json").FitBitID; // relative to private/data/*
  } catch(err) {
    newID = MANUAL_DEVICE_ID;  // default to manually set ID
    logError(err);
  }
  return newID;
}

function getIDFromServer() {
  let newID = 0;
  if (peerSocket.readyState === peerSocket.OPEN) {
    try {
      peerSocket.send("ID_REQUEST");
    } catch(err) {
      newID = getIDFromFile();
      logError(err);
    }
  }
}

