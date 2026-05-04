import { User, Workspace } from "../models/types";

// Seed data - two workspaces, four users
// workspace "ws-alpha": alice (owner), carol (member), dave (delegated member)
// workspace "ws-beta":  bob (owner)

export const workspaces: Map<string, Workspace> = new Map([
  [
    "ws-alpha",
    {
      id: "ws-alpha",
      name: "Alpha Corp",
      settings: { theme: "light", notifications: true },
    },
  ],
  [
    "ws-beta",
    {
      id: "ws-beta",
      name: "Beta LLC",
      settings: { theme: "dark", notifications: false },
    },
  ],
]);

export const users: Map<string, User> = new Map([
  [
    "user-alice",
    {
      id: "user-alice",
      username: "alice",
      email: "alice@alpha.com",
      workspaceId: "ws-alpha",
      role: "owner",
      preferences: { language: "en", timezone: "UTC" },
    },
  ],
  [
    "user-carol",
    {
      id: "user-carol",
      username: "carol",
      email: "carol@alpha.com",
      workspaceId: "ws-alpha",
      role: "member",
      preferences: { language: "fr", timezone: "Europe/Paris" },
    },
  ],
  [
    "user-dave",
    {
      id: "user-dave",
      username: "dave",
      email: "dave@alpha.com",
      workspaceId: "ws-alpha",
      role: "member",
      elevated: true,
      preferences: { language: "en", timezone: "UTC" },
    },
  ],
  [
    "user-bob",
    {
      id: "user-bob",
      username: "bob",
      email: "bob@beta.com",
      workspaceId: "ws-beta",
      role: "owner",
      preferences: { language: "en", timezone: "America/New_York" },
    },
  ],
]);

// Lookup helpers
export function getUserById(id: string): User | undefined {
  return users.get(id);
}

export function getUsersByWorkspace(workspaceId: string): User[] {
  return Array.from(users.values()).filter(
    (u) => u.workspaceId === workspaceId
  );
}

export function getWorkspaceById(id: string): Workspace | undefined {
  return workspaces.get(id);
}
