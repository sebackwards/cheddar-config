const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../dist/index");

const app = createApp();

describe("health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "ok");
  });
});

describe("authentication", () => {
  it("rejects requests with no user header", async () => {
    const res = await request(app).get("/users/me");
    assert.equal(res.status, 401);
  });
  it("rejects requests with unknown user id", async () => {
    const res = await request(app).get("/users/me").set("x-user-id", "user-nobody");
    assert.equal(res.status, 401);
  });
});

describe("GET /users/me", () => {
  it("returns the authenticated user profile", async () => {
    const res = await request(app).get("/users/me").set("x-user-id", "user-alice");
    assert.equal(res.status, 200);
    assert.equal(res.body.username, "alice");
    assert.equal(res.body.workspaceId, "ws-alpha");
  });
});

describe("GET /users (owner only)", () => {
  it("allows workspace owner to list members", async () => {
    const res = await request(app).get("/users").set("x-user-id", "user-alice");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
  });
  it("blocks a member from listing users", async () => {
    const res = await request(app).get("/users").set("x-user-id", "user-carol");
    assert.equal(res.status, 403);
  });
});

describe("GET /preferences", () => {
  it("returns the user preferences", async () => {
    const res = await request(app).get("/preferences").set("x-user-id", "user-alice");
    assert.equal(res.status, 200);
    assert.equal(res.body.language, "en");
  });
});

describe("PATCH /preferences", () => {
  it("merges a scalar preference update", async () => {
    const res = await request(app)
      .patch("/preferences")
      .set("x-user-id", "user-bob")
      .set("content-type", "application/json")
      .send('{"language":"es"}');
    assert.equal(res.status, 200);
    assert.equal(res.body.preferences.language, "es");
  });
});

describe("GET /workspace", () => {
  it("returns workspace info for any member", async () => {
    const res = await request(app).get("/workspace").set("x-user-id", "user-carol");
    assert.equal(res.status, 200);
    assert.equal(res.body.name, "Alpha Corp");
  });
});

describe("PATCH /workspace/settings (owner only)", () => {
  it("allows owner to update workspace settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-alice")
      .set("content-type", "application/json")
      .send('{"theme":"system"}');
    assert.equal(res.status, 200);
    assert.equal(res.body.settings.theme, "system");
  });
  it("blocks a member from updating workspace settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-carol")
      .set("content-type", "application/json")
      .send('{"theme":"dark"}');
    assert.equal(res.status, 403);
  });
});