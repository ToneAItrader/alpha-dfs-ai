# V2.2 Data Model — Canonical Evidence Schema

**Status:** Planning Complete — Program 5  
**Date:** 2026-07-19  
**Related:** [ADR-020](./ADR-020-V2_2_EVIDENCE_FUSION_ENGINE.md)

---

## Entity relationship

```text
EvidenceProvider ──produces──▶ EvidencePackage ──contains──▶ EvidenceItem
                                      │
                                      ▼
                              Evidence Fusion Engine
                                      │
                                      ▼
                         NormalizedEvidenceBundle
                                      │
                         contains ──▶ NormalizedEvidence
                                      │
                         contains ──▶ EvidenceItem (fused)
                                      │
                         optional ──▶ ConflictRecord

SourceReliabilityRecord ◀── updates ── Historical Learning Provider
SourceRegistry ◀── configures ── ProviderDescriptor
```

---

## Persistence (Prisma — additive, ADR-009)

### MVP (M4–M6): optional audit

```prisma
model EvidenceAuditRun {
  id        String   @id @default(cuid())
  runId     String
  slateId   String
  fusedAt   DateTime
  bundleJson String  // compressed JSON — ops/debug only
  createdAt DateTime @default(now())
}
```

### M7+: learning tables

```prisma
model SourceReliability {
  id           String   @id @default(cuid())
  sourceId     String   @unique
  sampleCount  Int
  accuracyScore Float
  weight       Float
  updatedAt    DateTime @updatedAt
}
```

---

## Versioning strategy

| Artifact | Version field |
|----------|---------------|
| EvidencePackage | `sourceVersion` per provider |
| NormalizedEvidenceBundle | `version: "fusion-1.0"` |
| Prisma schema | ADR-009 migration per table |

---

## DTO impact

V2.2 **does not** add ADI fields to presentation DTOs. Engine outputs may include improved values (projection, ownership) — mappers unchanged unless display of confidence source is ADR-approved (default: no).

---

## Storage considerations

- In-memory cache: default MVP path
- Audit table: optional; flag `ADI_EVIDENCE_AUDIT_ENABLED`
- No raw provider payload persistence (privacy + size)
