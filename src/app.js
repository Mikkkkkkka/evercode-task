import config from "./config/index.js";
import createLogger from "./logger/index.js";
import { scheduleTask } from "./core/scheduler.js";

const appLogger = createLogger("app");

appLogger("app.js started");

scheduleTask(
  "running-task",
  config.settings.schedulerInterval,
  () => {
    appLogger("running");
  },
  { logger: createLogger("scheduler") }
);
