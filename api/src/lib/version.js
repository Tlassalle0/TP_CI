const pkg = require("../../package.json");

// Version applicative : priorité à APP_VERSION (injectée au build / déploiement),
// sinon la version du package.json.
module.exports = {
  version: process.env.APP_VERSION || pkg.version,
};
