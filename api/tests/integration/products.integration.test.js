const request = require("supertest");

// Test d'intégration : utilise une VRAIE base PostgreSQL (pas de mock).
// Exécuté uniquement quand RUN_INTEGRATION=1 (donc en CI), pour que `npm test`
// reste vert en local sans base disponible.
const describeIntegration = process.env.RUN_INTEGRATION ? describe : describe.skip;

describeIntegration("GET /products (intégration PostgreSQL)", () => {
  let app;
  let db;

  beforeAll(() => {
    app = require("../../src/app");
    db = require("../../src/db");
  });

  afterAll(async () => {
    await db.getPool().end();
  });

  test("retourne les produits seedés par database/init.sql", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.source).toBe("database");
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0]).toHaveProperty("price_cents");
  });

  test("/health voit la base comme ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.checks.database).toBe("ok");
  });
});
