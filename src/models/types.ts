// A user account in the system
export interface User {
  id: string;
  username: string;
  email: string;
  workspaceId: string;
  // Role controls what actions the user can perform
  // "member" = standard user, "owner" = workspace owner
  role: "member" | "owner";
  // Workspace-level preferences, set by the user
  preferences: Record<string, unknown>;
  // Delegation token set during owner handoff flows.
  // Grants temporary elevated access to a member for workspace administration.
  _handoffGrant?: true;
}

// A workspace groups users together
export interface Workspace {
  id: string;
  name: string;
  // Configuration applied to all members of this workspace
  settings: Record<string, unknown>;
}

// What gets attached to req.user after authentication
export interface AuthenticatedUser {
  id: string;
  username: string;
  workspaceId: string;
  role: "member" | "owner";
}
