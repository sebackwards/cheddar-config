export function applyLayeredConfig(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = (target as any)[key];

    if (
      sourceVal !== null &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal !== null &&
      targetVal !== undefined &&
      (typeof targetVal === "object" || typeof targetVal === "function") &&
      !Array.isArray(targetVal)
    ) {
      applyLayeredConfig(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      );
    } else {
      (target as any)[key] = sourceVal;
    }
  }

  return target;
}
