import * as settings from "./companion-settings";

settings.initialize();

import * as messaging from "messaging";
// const WebSocket = require('ws');
// let socket;
// const socket = new WebSocket('wss://192.168.1.223:8876');
// socket.close();

// socket.addEventListener("open", onOpen);
// socket.addEventListener("error", onError);

function onOpen(evt) {
    console.log("CONNECTED");
}

function onError(evt) {
    console.log("ERROR: ${evt.data}");
}

function sendHeartRate(data) {
    console.log(data);
    // console.log("Sending Heart Rate by http");
    // fetch('https://192.168.1.223:8876', {
    //     method: "POST",
    //     // headers: {
    //     //     'Content-Type': 'application/json',
    //     // },
    //     body: JSON.stringify(data),
    // })
    //     .then((response) => response.json())
    //     .then((data) => console.log("Success ", data))
    //     .catch((error) => console.error("Error: ", error));
}

messaging.peerSocket.onmessage = function(event) {
    // console.log("Data recieved from app");
    if(event.data) {
        sendHeartRate(event.data.HeartRate);
    }
}

