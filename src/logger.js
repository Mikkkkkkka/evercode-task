import config from "./config.js";

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}.${month}.${year}-${hours}:${minutes}:${seconds}`;
}

function createLogger(scope = config.appName) {
  return function log(message) {
    const timestamp = formatDate(new Date());

    console.log(`[${scope}] [${timestamp}] -- ${message}`);
  };
}

export default createLogger;
