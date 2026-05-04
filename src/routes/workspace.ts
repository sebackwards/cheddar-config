import { Router } from "express";
import { authenticate, requireElevated } from "cheddar-config/middleware/access";
import { getWorkspaceById } from "cheddar-config/db/store";
import { applyLayeredConfig } from "cheddar-config/utils/config";

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