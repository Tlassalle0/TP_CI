const log = require("../src/lib/logger");

describe("logger.sanitize", () => {
  test("masque les clés sensibles", () => {
    const clean = log.sanitize({
      user: "alice",
      password: "s3cret",
      token: "abc123",
      DATABASE_URL: "postgres://u:p@db/x",
    });

    expect(clean.user).toBe("alice");
    expect(clean.password).toBe("***REDACTED***");
    expect(clean.token).toBe("***REDACTED***");
    expect(clean.DATABASE_URL).toBe("***REDACTED***");
  });

  test("masque récursivement dans les objets imbriqués et les tableaux", () => {
    const clean = log.sanitize({
      list: [{ secret: "x" }, { ok: 1 }],
      nested: { auth: "bearer xyz" },
    });

    expect(clean.list[0].secret).toBe("***REDACTED***");
    expect(clean.list[1].ok).toBe(1);
    expect(clean.nested.auth).toBe("***REDACTED***");
  });

  test("gère les références circulaires", () => {
    const obj = { a: 1 };
    obj.self = obj;

    const clean = log.sanitize(obj);

    expect(clean.a).toBe(1);
    expect(clean.self).toBe("[Circular]");
  });

  test("retourne les valeurs primitives telles quelles", () => {
    expect(log.sanitize(42)).toBe(42);
    expect(log.sanitize(null)).toBe(null);
    expect(log.sanitize("texte")).toBe("texte");
  });
});

describe("niveaux de log", () => {
  test("écrit un message info sur stdout", () => {
    const spy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    log.info("hello", { foo: "bar" });
    expect(spy).toHaveBeenCalled();
    const payload = JSON.parse(spy.mock.calls[0][0]);
    expect(payload.level).toBe("info");
    expect(payload.message).toBe("hello");
    spy.mockRestore();
  });

  test("écrit une erreur sur stderr", () => {
    const spy = jest.spyOn(process.stderr, "write").mockImplementation(() => true);
    log.error("boom");
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test("filtre les niveaux sous le seuil courant (debug ignoré par défaut)", () => {
    const spy = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    log.debug("ne doit pas apparaître");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
