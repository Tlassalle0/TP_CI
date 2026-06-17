const request = require("supertest");

jest.mock("../src/db");
const db = require("../src/db");
const app = require("../src/app");

const SAMPLE = [
  { id: 1, name: "Clavier compact", description: "...", price_cents: 5990 },
  { id: 2, name: "Souris precision", description: "...", price_cents: 3490 },
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
