const { randomUUID } = require("crypto");
const log = require("../lib/logger");

// Middleware de traçage des requêtes :
// - récupère ou génère un request_id et le propage (req + header de réponse),
// - logge chaque requête terminée en JSON structuré avec son niveau.
module.exports = function logger(req, res, next) {
  const requestId = req.headers["x-request-id"] || randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const startedAt = Date.now();

  res.on("finish", () => {
    const meta = {
      request_id: requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: Date.now() - startedAt,
    };

    // Le niveau de log dépend de la gravité du statut HTTP.
    if (res.statusCode >= 500) {
      log.error("request completed", meta);
    } else if (res.statusCode >= 400) {
      log.warn("request completed", meta);
    } else {
      log.info("request completed", meta);
    }
  });

  next();
};
