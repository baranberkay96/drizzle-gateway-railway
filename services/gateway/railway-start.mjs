// Railway start wrapper for Drizzle Gateway (written for this template).
//
// Drizzle Gateway serves its whole UI and API without any login when
// MASTERPASS is empty, and stops at boot on a bad PORT or SESSION_TTL_DAYS.
// Before loading the gateway this wrapper:
//   - requires a MASTERPASS of 8-128 characters; otherwise it locks the
//     gateway with a random master password nobody knows and logs how to fix
//     it (the deploy still succeeds, STANDARD 8.29);
//   - falls back to port 4983 for a PORT that is not 1-65535;
//   - drops a SESSION_TTL_DAYS that is not a positive number (default 30);
// then imports /entry/index.js in this same process (WORKDIR /entry).
import { randomBytes } from "node:crypto";

const DEFAULT_PORT = "4983";
const MIN_PASSWORD = 8;
const MAX_PASSWORD = 128;

const log = (message) => console.log(`railway-drizzle: ${message}`);

function checkedMasterpass(value) {
  const length = (value ?? "").length;
  if (length >= MIN_PASSWORD && length <= MAX_PASSWORD) {
    return value;
  }
  log(`WARNING: MASTERPASS must be ${MIN_PASSWORD}-${MAX_PASSWORD} characters (got ${length}). The gateway is locked with a random master password.`);
  log(`Fix: set MASTERPASS to ${MIN_PASSWORD}-${MAX_PASSWORD} characters on this service and redeploy.`);
  return randomBytes(30).toString("base64url");
}

function checkedPort(value) {
  const port = Number(value);
  if (/^\d+$/.test(value ?? "") && port >= 1 && port <= 65535) {
    return String(port);
  }
  log(`PORT='${value ?? ""}' is not a valid port, using ${DEFAULT_PORT}`);
  return DEFAULT_PORT;
}

function checkedSessionDays(value) {
  if (value === undefined || value === "") {
    return undefined;
  }
  const days = Number(value);
  if (Number.isFinite(days) && days > 0) {
    return value;
  }
  log(`SESSION_TTL_DAYS='${value}' is not a positive number, using the default (30)`);
  return undefined;
}

process.env.MASTERPASS = checkedMasterpass(process.env.MASTERPASS);
process.env.PORT = checkedPort(process.env.PORT);
const sessionDays = checkedSessionDays(process.env.SESSION_TTL_DAYS);
if (sessionDays === undefined) {
  delete process.env.SESSION_TTL_DAYS;
}

log(`master password set, port ${process.env.PORT}, store ${process.env.STORE_PATH || "/app"}`);
await import("/entry/index.js");
