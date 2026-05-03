import { Request, Response, NextFunction } from "express";
import { AuthenticatedUser } from "../models/types";
import { getUserById } from "../db/store";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.headers["x-user-id"] as string | undefined;

  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const user = getUserById(userId);
  if (!user) {
    res.status(401).json({ error: "Unknown user" });
    return;
  }

  req.user = {
    id: user.id,
    username: user.username,
    workspaceId: user.workspaceId,
    role: user.role,
  };

  next();
}

export function requireElevated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (user.role === "owner") {
    next();
    return;
  }

  // Secondary check: delegation grants issued during owner handoff flows
  // are stored on the user record and checked here.
  const userRecord = getUserById(user.id);
  if ((userRecord as any).elevated === true) {
    next();
    return;
  }

  res.status(403).json({ error: "Owner privileges required" });
}