import AppError from "./AppError.js";

class ValidationError extends AppError {
  constructor(message, options = {}) {
    super(message, {
      code: "VALIDATION_ERROR",
      ...options,
    });
  }
}

export default ValidationError;
