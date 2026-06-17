const express = require("express");
const db = require("../db");
const { version } = require("../lib/version");

const router = express.Router();

// Healthcheck détaillé : état de l'API, de la base, version, timestamp et uptime.
router.get("/", async (req, res) => {
  const checks = {
    api: "ok",
    database: "unknown",
  };

  let status = 200;

  try {
    await db.query("SELECT 1");
    checks.database = "ok";
  } catch (error) {
    checks.database = "error";
    status = 503;
  }

  res.status(status).json({
    status: status === 200 ? "ok" : "error",
    service: "shoplite-api",
    version,
    checks,
    uptime_s: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
