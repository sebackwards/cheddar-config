// Strips sensitive user-record fields from incoming preference payloads.
// Prevents callers from overwriting identity or authentication properties
// through the preferences merge endpoint.
const BLOCKED_PREFERENCE_KEYS = new Set(["id", "role", "email", "password", "workspaceId"]);

export function sanitizeIncomingPreferences(
  payload: Record<string, unknown>
): Record<string, unknown> {
  for (const key of Reflect.ownKeys(payload)) {
    if (typeof key === "string" && BLOCKED_PREFERENCE_KEYS.has(key)) {
      delete payload[key];
    }
  }

  return payload;
}
