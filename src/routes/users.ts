import { Router } from "express";
import { authenticate, requireElevated } from "../middleware/access";
import { getUserById, getUsersByWorkspace, getWorkspaceById } from "../db/store";

const router = Router();

// GET /users/me — any authenticated user can read their own profile
router.get("/me", authenticate, (req, res) => {
  const user = getUserById(req.user!.id);
  res.json(user);
});

// GET /users — list all users in the caller's workspace
// Requires owner privileges
router.get("/", authenticate, requireElevated, (req, res) => {
  const members = getUsersByWorkspace(req.user!.workspaceId);
  res.json(members);
});

// GET /users/:id — get a specific user (owner only)
router.get("/:id", authenticate, requireElevated, (req, res) => {
  const user = getUserById(req.params.id);

  if (!user || user.workspaceId !== req.user!.workspaceId) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

export default router;
