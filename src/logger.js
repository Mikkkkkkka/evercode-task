import config from "./config.js";

function createLogger(scope = config.appName) {
  return function log(message) {
    console.log(`[${scope}] ${Date.now()} -- ${message}`);
  };
}

export default createLogger;
