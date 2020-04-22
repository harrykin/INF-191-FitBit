/*
  tickHandler retrieves time
  Callback updates UI
*/

import clock from "clock";

let clockCallback;

export function initialize(granularity, callback) {
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

function tickHandler(evt) {
  let today = evt.date;
  let hours = today.getHours();
  // if (preferences.clockDisplay === "12h") {
  //   // 12h format
  //   hours = hours % 12 || 12;
  // } else {
  //   // 24h format
  //   if (hours < 10) {
  //     hours = "0" + hours;
  //   }
  // }
  let mins = (x => { if (x < 10){ return "0" + x;} else { return x; } })(today.getMinutes());

  let timeString = `${hours}:${mins}`;
  // let timeString = "Hello";
  // let dateString = "Harrison Quarry";

  clockCallback({time: timeString});
}
