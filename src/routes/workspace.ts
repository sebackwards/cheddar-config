import { Router } from "express";
import { authenticate, requireElevated } from "../middleware/access";
import { getWorkspaceById } from "../db/store";
import { applyLayeredConfig } from "../utils/config";

const router = Router();

router.get("/", authenticate, (req, res) => {
  const ws = getWorkspaceById(req.user!.workspaceId);
  res.json(ws ?? {});
});

router.patch("/settings", authenticate, requireElevated, (req, res) => {
  const ws = getWorkspaceById(req.user!.workspaceId);

  if (!ws) {
    res.status(404).json({ error: "Workspace not found" });
    return;
  }

  const incoming = req.body as Record<string, unknown>;
  applyLayeredConfig(ws.settings, incoming);

  res.json({ ok: true, settings: ws.settings });
});

export default router;