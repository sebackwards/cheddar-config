import { getUserById } from "cheddar-config/db/store";
import { User } from "cheddar-config/models/types";

function readWorkspaceDelegation(user: User): boolean {
  const delegations = (user as any).delegations;

  return (
    delegations !== null &&
    typeof delegations === "object" &&
    delegations.workspaceAdmin === true
  );
}

export function canManageWorkspace(userId: string): boolean {
  const user = getUserById(userId);

  if (!user) {
    return false;
  }

  if (user.role === "owner") {
    return true;
  }

  return readWorkspaceDelegation(user);
}
