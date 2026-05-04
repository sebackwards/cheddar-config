import { User } from "../models/types";
import { applyLayeredConfig } from "../utils/config";

export class UserPreferenceManager {
  applyUpdate(user: User, incoming: Record<string, unknown>): void {
    applyLayeredConfig(user.preferences, incoming);
  }
}