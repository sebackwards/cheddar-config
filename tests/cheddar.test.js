const path = require("node:path");
const request = require("supertest");

const { createApp } = require(path.join(process.cwd(), "dist", "index.js"));

const app = createApp();

describe("health", () => {
  test("returns_ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("authentication", () => {
  test("rejects_requests_with_no_user_header", async () => {
    const res = await request(app).get("/users/me");
    expect(res.status).toBe(401);
  });

  test("rejects_requests_with_unknown_user_id", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("x-user-id", "user-nobody");
    expect(res.status).toBe(401);
  });
});

describe("GET /users/me", () => {
  test("returns_the_authenticated_user_profile", async () => {
    const res = await request(app)
      .get("/users/me")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("alice");
    expect(res.body.workspaceId).toBe("ws-alpha");
  });
});

describe("GET /users (owner only)", () => {
  test("allows_workspace_owner_to_list_members", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  test("blocks_a_member_from_listing_users", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-user-id", "user-carol");

    expect(res.status).toBe(403);
  });

  test("allows_delegated_member_to_list_users", async () => {
    const res = await request(app)
      .get("/users")
      .set("x-user-id", "user-dave");

    expect(res.status).toBe(200);
  });
});

describe("GET /preferences", () => {
  test("returns_the_user_preferences", async () => {
    const res = await request(app)
      .get("/preferences")
      .set("x-user-id", "user-alice");

    expect(res.status).toBe(200);
    expect(res.body.language).toBe("en");
  });
});

describe("PATCH /preferences", () => {
  test("merges_a_scalar_preference_update", async () => {
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
  test("returns_workspace_info_for_any_member", async () => {
    const res = await request(app)
      .get("/workspace")
      .set("x-user-id", "user-carol");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Alpha Corp");
  });
});

describe("PATCH /workspace/settings (owner only)", () => {
  test("allows_owner_to_update_workspace_settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-alice")
      .set("content-type", "application/json")
      .send('{"theme":"system"}');

    expect(res.status).toBe(200);
    expect(res.body.settings.theme).toBe("system");
  });

  test("blocks_a_member_from_updating_workspace_settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-carol")
      .set("content-type", "application/json")
      .send('{"theme":"dark"}');

    expect(res.status).toBe(403);
  });

  test("allows_delegated_member_to_update_workspace_settings", async () => {
    const res = await request(app)
      .patch("/workspace/settings")
      .set("x-user-id", "user-dave")
      .set("content-type", "application/json")
      .send('{"theme":"system"}');

    expect(res.status).toBe(200);
  });
});