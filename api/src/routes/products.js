const express = require("express");
const db = require("../db");

const router = express.Router();

const LOW_STOCK_THRESHOLD = 5;

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, price_cents, stock FROM products ORDER BY id",
    );

    // v1.1.0 : indicateur low_stock, calculé de façon NULL-SAFE.
    // `stock` peut être absent (anciennes lignes) ou null : on retombe sur 0.
    const data = result.rows.map((row) => {
      const stock = Number(row.stock ?? 0);
      return { ...row, stock, low_stock: stock <= LOW_STOCK_THRESHOLD };
    });

    res.json({
      source: "database",
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
