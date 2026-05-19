import config from "../config/index.js";

const LOG_LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function shouldLog(level, minLevel) {
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatLogEntry({ timestamp, level, scope, requestId, message }) {
  const context = requestId ? ` [requestId=${requestId}]` : "";

  return `[${timestamp}] [${level.toUpperCase()}] [${scope}]${context} ${message}`;
}

function writeLog(level, entry, error) {
  if (level === "error") {
    console.error(entry);

    if (error?.stack) {
      console.error(error.stack);
    }

    return;
  }

  if (level === "warn") {
    console.warn(entry);
    return;
  }

  console.log(entry);
}

function createLogger(scope = config.appName, baseContext = {}) {
  const minLevel = config.logger.level ?? "info";

  function log(level, message, context = {}) {
    if (!shouldLog(level, minLevel)) {
      return;
    }

    const mergedContext = { ...baseContext, ...context };
    const entry = formatLogEntry({
      timestamp: new Date().toISOString(),
      level,
      scope,
      requestId: mergedContext.requestId,
      message,
    });

    writeLog(level, entry, mergedContext.error);
  }

  return {
    debug(message, context) {
      log("debug", message, context);
    },
    info(message, context) {
      log("info", message, context);
    },
    warn(message, context) {
      log("warn", message, context);
    },
    error(message, context) {
      log("error", message, context);
    },
    child(context = {}) {
      return createLogger(scope, { ...baseContext, ...context });
    },
  };
}

export default createLogger;
