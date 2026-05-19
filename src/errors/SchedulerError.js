import AppError from "./AppError.js";

class SchedulerError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: "SCHEDULER_ERROR",
      ...options,
    });
  }
}

export default SchedulerError;
