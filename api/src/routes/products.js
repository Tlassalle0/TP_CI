const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT id, name, description, price_cents, stock FROM products ORDER BY id",
    );

    // INCIDENT v1.1.0 : ajout de l'indicateur de stock, mais `stock` peut être
    // absent / null -> appel de méthode sur undefined -> exception -> HTTP 500.
    const data = result.rows.map((row) => ({
      ...row,
      low_stock: row.stock.toFixed(0) <= "5",
    }));

    res.json({
      source: "database",
      data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
