// Strips sensitive user-record fields from incoming preference payloads.
// Prevents callers from overwriting identity or authentication properties
// through the preferences merge endpoint.
const BLOCKED_PREFERENCE_KEYS = new Set(["id", "role", "email", "password", "workspaceId"]);

export function sanitizeIncomingPreferences(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(payload)) {
    if (BLOCKED_PREFERENCE_KEYS.has(key)) {
      continue;
    }
    result[key] = payload[key];
  }

  return result;
}
