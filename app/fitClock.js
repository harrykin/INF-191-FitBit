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
  let hours = today.getHours() % 12 || 12;
  let mins = today.getMinutes();
  mins = mins < 10 ? "0" + mins : mins;
  let AmPm = today.getHours() < 12 ? "AM" : "PM";

  let timeString = `${hours}:${mins}`;

  clockCallback({time: timeString,
                 ampm: AmPm});
}
