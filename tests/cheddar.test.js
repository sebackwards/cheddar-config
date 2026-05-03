const path = require("node:path");
const request = require("supertest");

const { createApp } = require(path.join(process.cwd(), "dist", "index.js"));

const app = createApp();

describe("health", () => {
  test("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("authentication", () => {
  test("rejects requests with no user header", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(401);
  });

  test("rejects requests with unknown user id", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("x-user-id", "user-nobody");
    expect(res.status).toBe(401);
  });
});

describe("GET /users/me", () => {
  test("returns the authenticated user profile", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("alice");
    expect(res.body.workspaceId).toBe("ws-alpha");
  });
});

describe("GET /users (owner only)", () => {
  test("allows workspace owner to list members", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("blocks a member from listing users", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-user-id", "user-carol");

    expect(res.status).toBe(403);
  });
});

describe("GET /preferences", () => {
  test("returns the user preferences", async () => {
    const res = await request(app)
      .get("/preferences")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.language).toBe("en");
  });
});

describe("PATCH /preferences", () => {
  test("merges a scalar preference update", async () => {
    const res = await request(app)
      .patch("/preferences")
      .set("x-user-id", "user-bob")
      .set("content-type", "application/json")
      .send('{"language":"es"}');

    expect(res.status).toBe(200);
    expect(res.body.preferences.language).toBe("es");
  });
});

describe("GET /workspace", () => {
  test("returns workspace info for any member", async () => {
    const res = await request(app)
      .get("/workspace")
      .set("x-user-id", "user-carol");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Alpha Corp");
  });
});

describe("PATCH /workspace/settings (owner only)", () => {
  test("allows owner to update workspace settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-alice")
      .set("content-type", "application/json")
      .send('{"theme":"system"}');

    expect(res.status).toBe(200);
    expect(res.body.settings.theme).toBe("system");
  });

  test("blocks a member from updating workspace settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-carol")
      .set("content-type", "application/json")
      .send('{"theme":"dark"}');

    expect(res.status).toBe(403);
  });
});