const request = require("supertest");

jest.mock("../src/db");
const db = require("../src/db");
const app = require("../src/app");

describe("GET /ready", () => {
  test("retourne 200 ready:true quand la base est prête", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ "?column?": 1 }] });

    const response = await request(app).get("/ready");

    expect(response.status).toBe(200);
    expect(response.body.ready).toBe(true);
    expect(response.body.checks.database).toBe("ok");
  });

  test("retourne 503 ready:false quand la base n'est pas prête", async () => {
    db.query.mockRejectedValueOnce(new Error("not ready"));

    const response = await request(app).get("/ready");

    expect(response.status).toBe(503);
    expect(response.body.ready).toBe(false);
    expect(response.body.checks.database).toBe("error");
  });
});
