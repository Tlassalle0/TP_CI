require("dotenv").config();

const app = require("./app");
const log = require("./lib/logger");
const { version } = require("./lib/version");

const port = Number(process.env.API_PORT || process.env.PORT || 3000);

const server = app.listen(port, "0.0.0.0", () => {
  log.info("ShopLite API started", { port, version });
});

// Arrêt propre (utile pour les rolling updates / rollback Docker).
process.on("SIGTERM", () => {
  log.warn("SIGTERM reçu, arrêt du serveur");
  server.close(() => process.exit(0));
});
