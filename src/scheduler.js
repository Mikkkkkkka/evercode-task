import config from "./config.js";
import createLogger from "./logger.js";

const log = createLogger();

log("scheduler.js started");

function scheduleTask(name, interval, task) {
  if (typeof task !== "function") {
    throw new TypeError("task must be a function");
  }

  return setInterval(() => {
    log(`Task "${name}" started`);
    task();
  }, interval);
}

scheduleTask("running-task", config.settings.schedulerInterval, () => {
  log("running");
});

export default scheduleTask;
