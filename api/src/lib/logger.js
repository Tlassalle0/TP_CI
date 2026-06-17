// Logger applicatif structuré (JSON) avec niveaux et sanitization.
// Niveaux supportés, du moins au plus grave.
const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
  fatal: 50,
};

// Seuil courant lu depuis l'environnement (défaut: info).
const currentLevel = LEVELS[(process.env.LOG_LEVEL || "info").toLowerCase()] || LEVELS.info;

// Clés sensibles à masquer dans les logs (secrets, tokens, mots de passe...).
const SENSITIVE_KEYS = [
  "password",
  "pass",
  "pwd",
  "token",
  "secret",
  "authorization",
  "auth",
  "apikey",
  "api_key",
  "database_url",
  "connectionstring",
  "connection_string",
];

const REDACTED = "***REDACTED***";

// Masque récursivement les valeurs sensibles d'un objet pour ne jamais
// écrire un secret en clair dans les logs.
function sanitize(value, seen = new WeakSet()) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item, seen));
  }

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      out[key] = REDACTED;
    } else {
      out[key] = sanitize(val, seen);
    }
  }
  return out;
}

function emit(level, message, meta = {}) {
  if (LEVELS[level] < currentLevel) {
    return;
  }

  const line = JSON.stringify({
    level,
    message,
    ...sanitize(meta),
    timestamp: new Date().toISOString(),
  });

  // warn/error/fatal vers stderr, le reste vers stdout.
  if (LEVELS[level] >= LEVELS.warn) {
    process.stderr.write(`${line}\n`);
  } else {
    process.stdout.write(`${line}\n`);
  }
}

module.exports = {
  LEVELS,
  sanitize,
  debug: (message, meta) => emit("debug", message, meta),
  info: (message, meta) => emit("info", message, meta),
  warn: (message, meta) => emit("warn", message, meta),
  error: (message, meta) => emit("error", message, meta),
  fatal: (message, meta) => emit("fatal", message, meta),
};
