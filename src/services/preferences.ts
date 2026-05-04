import { User } from "cheddar-config/models/types";
import { applyLayeredConfig } from "cheddar-config/utils/config";

export class UserPreferenceManager {
  applyUpdate(user: User, incoming: Record<string, unknown>): void {
    applyLayeredConfig(user.preferences, incoming);
  }
}