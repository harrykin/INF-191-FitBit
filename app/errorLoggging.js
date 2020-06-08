/*
  Error Logging and handling
*/

import { peerSocket } from "messaging";

let tempErrorStorage = [];

export function logError(error) {
  // logErrorServer(error);
  console.log(error);
}

function logErrorServer(error) {
  if (peerSocket.readyState === peerSocket.OPEN) {
    peerSocket.send({
      "type" : "ERROR",
      "error" : error.name,
      "message" : error.message,
      "time" : error.time
    });
  } else {
    tempErrorStorage.push(error);
  }
}

function sendBacklogErrors() {
  // undefined
}

