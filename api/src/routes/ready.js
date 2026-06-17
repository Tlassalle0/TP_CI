const express = require("express");
const db = require("../db");

const router = express.Router();

// Readiness : l'application est-elle prête à recevoir du trafic ?
// Contrairement à /health (liveness + détails), /ready se concentre sur la
// disponibilité réelle des dépendances critiques (ici PostgreSQL).
router.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      ready: true,
      checks: { database: "ok" },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      checks: { database: "error" },
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
