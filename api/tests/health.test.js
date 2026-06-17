const request = require("supertest");

jest.mock("../src/db");
const db = require("../src/db");
const app = require("../src/app");

describe("Routes de base et santé", () => {
  test("GET / retourne le nom et les endpoints de l'API", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("ShopLite API");
    expect(response.body.endpoints).toContain("/products");
  });

  test("GET /health retourne 200 quand la base répond", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.checks.database).toBe("ok");
    expect(response.body).toHaveProperty("version");
    expect(response.body).toHaveProperty("uptime_s");
  });

  test("GET /health retourne 503 quand la base est en erreur", async () => {
    db.query.mockRejectedValueOnce(new Error("db down"));

    const response = await request(app).get("/health");

    expect(response.status).toBe(503);
    expect(response.body.status).toBe("error");
    expect(response.body.checks.database).toBe("error");
  });

  test("propage le X-Request-Id fourni par le client", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app)
      .get("/health")
      .set("X-Request-Id", "test-req-123");

    expect(response.headers["x-request-id"]).toBe("test-req-123");
  });

  test("GET sur une route inconnue retourne 404", async () => {
    const response = await request(app).get("/route-inexistante");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Route not found");
  });
});
