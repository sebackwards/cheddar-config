import { User } from "../models/types";
import { applyLayeredConfig } from "../utils/config";

/**
 * Manages user preference updates.
 * Handles layered merging of incoming preference payloads onto existing user preferences.
 */
export class UserPreferenceManager {
  /**
   * Applies a partial preference update to the given user.
   * Only keys present in the incoming payload are changed;
   * existing preferences not mentioned in the payload are preserved.
   */
  applyUpdate(user: User, incoming: Record<string, unknown>): void {
    applyLayeredConfig(user.preferences, incoming);
  }
}
