import { Router } from "express";
import { authenticate } from "../middleware/access";
import { getUserById } from "../db/store";
import { UserPreferenceManager } from "../services/preferences";

const router = Router();
const preferenceManager = new UserPreferenceManager();

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
  preferenceManager.applyUpdate(user, incoming);

  res.json({ ok: true, preferences: user.preferences });
});

export default router;
