class AppError extends Error {
  constructor(message, options = {}) {
    const {
      code = "APP_ERROR",
      details = {},
      cause,
    } = options;

    super(message, cause ? { cause } : undefined);

    this.name = new.target.name;
    this.code = code;
    this.details = details;

    if (cause) {
      this.cause = cause;
    }
  }
}

export default AppError;
