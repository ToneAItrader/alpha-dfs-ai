import type { AdiEvidenceItem, AdiEvidencePackage } from "@alpha-dfs/shared";
import type { ValidatedPackage } from "./types";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isValidConfidence(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}

function isValidItem(item: unknown): item is AdiEvidenceItem {
  if (!item || typeof item !== "object") return false;
  const candidate = item as AdiEvidenceItem;
  return (
    isNonEmptyString(candidate.itemId) &&
    isNonEmptyString(candidate.evidenceType) &&
    isNonEmptyString(candidate.subjectType) &&
    isNonEmptyString(candidate.subjectId) &&
    isNonEmptyString(candidate.claim) &&
    isValidConfidence(candidate.confidence) &&
    isNonEmptyString(candidate.observedAt)
  );
}

function isValidPackage(pkg: AdiEvidencePackage): string | null {
  if (!isNonEmptyString(pkg.packageId)) return "missing packageId";
  if (!isNonEmptyString(pkg.sourceId)) return "missing sourceId";
  if (!isNonEmptyString(pkg.runId)) return "missing runId";
  if (!isNonEmptyString(pkg.slateId)) return "missing slateId";
  if (!isNonEmptyString(pkg.fetchedAt)) return "missing fetchedAt";
  if (!Array.isArray(pkg.items)) return "items must be an array";
  if (!isValidConfidence(pkg.providerConfidence)) return "invalid providerConfidence";
  if (typeof pkg.ttlSeconds !== "number" || pkg.ttlSeconds < 0) return "invalid ttlSeconds";

  for (const item of pkg.items) {
    if (!isValidItem(item)) return `invalid item ${(item as AdiEvidenceItem | undefined)?.itemId ?? "unknown"}`;
  }

  return null;
}

export function validatePackages(packages: AdiEvidencePackage[]): ValidatedPackage[] {
  return packages.map((pkg) => {
    const reason = isValidPackage(pkg);
    if (reason) {
      return { package: pkg, valid: false, reason };
    }
    return { package: pkg, valid: true };
  });
}

export function filterValidPackages(validated: ValidatedPackage[]): AdiEvidencePackage[] {
  return validated.filter((entry): entry is ValidatedPackage & { valid: true } => entry.valid).map((entry) => entry.package);
}

export function collectValidationNotes(validated: ValidatedPackage[]): string[] {
  return validated
    .filter((entry): entry is ValidatedPackage & { valid: false } => !entry.valid)
    .map((entry) => `Rejected package ${entry.package.packageId}: ${entry.reason}`);
}
