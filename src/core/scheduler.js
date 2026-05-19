import createLogger from "../logger/index.js";
import SchedulerError from "../errors/SchedulerError.js";
import ValidationError from "../errors/ValidationError.js";
import createRequestId from "../utils/requestId.js";

const defaultLogger = createLogger("scheduler");

function validateName(name) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new ValidationError("name must be a non-empty string", {
      details: { field: "name", value: name },
    });
  }
}

function validateInterval(interval) {
  if (!Number.isInteger(interval) || interval <= 0) {
    throw new ValidationError("interval must be a positive integer", {
      details: { field: "interval", value: interval },
    });
  }
}

function validateTask(task) {
  if (typeof task !== "function") {
    throw new ValidationError("task must be a function", {
      details: { field: "task", valueType: typeof task },
    });
  }
}

export function scheduleTask(name, interval, task, options = {}) {
  validateName(name);
  validateInterval(interval);
  validateTask(task);

  const logger = options.logger ?? defaultLogger;

  logger.info(`Task "${name}" scheduled with interval ${interval}ms`);

  return setInterval(() => {
    const requestId = createRequestId();
    const taskLogger = logger.child({ requestId });

    taskLogger.info(`Task "${name}" started`);

    try {
      task({ requestId, logger: taskLogger });
      taskLogger.info(`Task "${name}" finished`);
    } catch (error) {
      const schedulerError = new SchedulerError(`Task "${name}" failed`, {
        details: { taskName: name, requestId },
        cause: error instanceof Error ? error : undefined,
      });

      taskLogger.error(schedulerError.message, {
        error: schedulerError,
      });
    }
  }, interval);
}

export default scheduleTask;
