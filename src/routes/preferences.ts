import { Router } from "express";
import { authenticate } from "../middleware/access";
import { getUserById, users } from "../db/store";
import { applyLayeredConfig } from "../utils/config";

const router = Router();

// GET /preferences — read the caller's current preferences
router.get("/", authenticate, (req, res) => {
  const user = getUserById(req.user!.id);
  res.json(user?.preferences ?? {});
});

// PATCH /preferences — update the caller's preferences
// Supports partial updates: only keys present in the body are changed.
router.patch("/", authenticate, (req, res) => {
  const user = getUserById(req.user!.id);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const incoming = req.body as Record<string, unknown>;

  // Layer the incoming values on top of the user's existing preferences.
  // This allows partial updates without overwriting unrelated settings.
  applyLayeredConfig(user.preferences, incoming);

  res.json({ ok: true, preferences: user.preferences });
});

export default router;
