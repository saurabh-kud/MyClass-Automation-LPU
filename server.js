var cron = require("node-cron");
const joinClass = require("./testJoin.js");
require("dotenv").config();

console.log("server +++++");

let task;

// Start the cron task
task = cron.schedule("0 9 * * *", () => {
  console.log("cron time start ");
  joinClass();
  console.log("stard join class");
  // Calculate the remaining time until the cron task should stop
  const endTime = new Date().getTime() + 60 * 1000;

  // Stop the task when the remaining time elapses
  const stopTask = () => {
    console.log(new Date().getTime());
    const currentTime = new Date().getTime();
    if (currentTime >= endTime) {
      console.log("Task stopped after 2 hours");

      task.stop();
      console.log("Task stopped after 2 hours");
    } else {
      setTimeout(stopTask, endTime - currentTime);
    }
  };

  // Start the countdown
  setTimeout(stopTask, 60 * 1000);
});
