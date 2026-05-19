import createLogger from "../logger/index.js";

const defaultLogger = createLogger("scheduler");

function validateName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new TypeError("name must be a non-empty string");
  }
}

function validateInterval(interval) {
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new TypeError("interval must be a positive integer");
  }
}

function validateTask(task) {
  if (typeof task !== "function") {
    throw new TypeError("task must be a function");
  }
}

export function scheduleTask(name, interval, task, options = {}) {
  validateName(name);
  validateInterval(interval);
  validateTask(task);

  const logger = options.logger ?? defaultLogger;

  logger(`Task "${name}" scheduled with interval ${interval}ms`);

  return setInterval(() => {
    logger(`Task "${name}" started`);

    try {
      task();
      logger(`Task "${name}" finished`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      logger(`Task "${name}" failed: ${message}`);
    }
  }, interval);
}

export default scheduleTask;
