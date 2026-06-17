const request = require("supertest");

jest.mock("../src/db");
const db = require("../src/db");
const app = require("../src/app");

const SAMPLE = [
  { id: 1, name: "Clavier compact", description: "...", price_cents: 5990, stock: 12 },
  { id: 2, name: "Souris precision", description: "...", price_cents: 3490, stock: 3 },
];

describe("GET /products", () => {
  afterEach(() => jest.clearAllMocks());

  // Test clé du TP : doit être VERT avant l'incident, ROUGE pendant, VERT après rollback.
  test("retourne la liste des produits depuis la base", async () => {
    db.query.mockResolvedValueOnce({ rows: SAMPLE });

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.source).toBe("database");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty("price_cents");
    expect(response.body.data[0].low_stock).toBe(false); // stock 12 > seuil
    expect(response.body.data[1].low_stock).toBe(true); // stock 3 <= seuil
  });

  test("calcule low_stock sans planter si stock est absent/null (null-safe)", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 9, name: "Sans stock", description: "...", price_cents: 100 }],
    });

    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.data[0].stock).toBe(0);
    expect(response.body.data[0].low_stock).toBe(true);
  });

  test("interroge la table products", async () => {
    db.query.mockResolvedValueOnce({ rows: SAMPLE });

    await request(app).get("/products");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query.mock.calls[0][0]).toMatch(/from products/i);
  });

  test("retourne 500 quand la base est en erreur", async () => {
    db.query.mockRejectedValueOnce(new Error("connexion perdue"));

    const response = await request(app).get("/products");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });
});
