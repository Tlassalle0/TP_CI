const express = require("express");
const cors = require("cors");
const logger = require("./middleware/logger");
const log = require("./lib/logger");
const { version } = require("./lib/version");
const healthRoutes = require("./routes/health");
const readyRoutes = require("./routes/ready");
const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.json({
    name: "ShopLite API",
    version,
    endpoints: ["/health", "/ready", "/products"],
  });
});

app.use("/health", healthRoutes);
app.use("/ready", readyRoutes);
app.use("/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  log.error("unhandled error", {
    request_id: req.requestId,
    error: err.message,
    path: req.originalUrl,
  });

  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
