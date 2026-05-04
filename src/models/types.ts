export interface Delegations {
  workspaceAdmin?: boolean;
  issuedBy?: string;
  reason?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  workspaceId: string;
  role: "member" | "owner";
  preferences: Record<string, unknown>;
  delegations?: Delegations;
}

export interface Workspace {
  id: string;
  name: string;
  settings: Record<string, unknown>;
}

export interface AuthenticatedUser {
  id: string;
  username: string;
  workspaceId: string;
  role: "member" | "owner";
}