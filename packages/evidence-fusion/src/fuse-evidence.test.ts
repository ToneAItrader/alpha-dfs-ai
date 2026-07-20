import type { AdiEvidenceItem } from "@alpha-dfs/shared";
import { describe, expect, it } from "vitest";
import { deduplicateItems } from "./deduplicate-items";
import { expireItems, computeFreshnessScore } from "./expire-items";
import { fuseEvidence, getFusedSubject } from "./fuse-evidence";
import { resolveConflicts } from "./resolve-conflicts";
import { validatePackages } from "./validate-packages";
import { weightItems } from "./weight-items";
import { fusionContext, makeEvidenceItem, makeEvidencePackage, mockRegistry } from "./test-helpers";

describe("validatePackages", () => {
  it("accepts valid packages", () => {
    const result = validatePackages([
      makeEvidencePackage({
        packageId: "pkg-1",
        sourceId: "news-ap",
        items: [makeEvidenceItem({ itemId: "i-1", subjectId: "sp-1" })],
      }),
    ]);
    expect(result[0]?.valid).toBe(true);
  });

  it("rejects packages missing required fields", () => {
    const result = validatePackages([
      makeEvidencePackage({ packageId: "", sourceId: "news-ap" }),
    ]);
    expect(result[0]?.valid).toBe(false);
  });
});

describe("expireItems", () => {
  it("drops expired items by expiresAt", () => {
    const pkg = makeEvidencePackage({
      packageId: "pkg-exp",
      sourceId: "news-ap",
      items: [
        makeEvidenceItem({
          itemId: "expired",
          subjectId: "sp-1",
          expiresAt: "2026-07-19T11:00:00.000Z",
        }),
      ],
    });

    const { active, expired } = expireItems([pkg], Date.parse("2026-07-19T12:00:00.000Z"));
    expect(active).toHaveLength(0);
    expect(expired).toHaveLength(1);
  });

  it("computes freshness score near 1 for recent observations", () => {
    expect(computeFreshnessScore("2026-07-19T12:00:00.000Z", Date.parse("2026-07-19T12:10:00.000Z"))).toBeGreaterThan(
      0.9,
    );
  });
});

describe("deduplicateItems", () => {
  it("keeps highest confidence duplicate within window", () => {
    const pkg = makeEvidencePackage({
      packageId: "pkg-dedupe",
      sourceId: "news-ap",
      items: [],
    });

    const active = [
      {
        item: makeEvidenceItem({
          itemId: "low",
          subjectId: "sp-1",
          evidenceType: "injury_status",
          direction: "negative",
          confidence: 0.6,
          observedAt: "2026-07-19T12:00:00.000Z",
        }),
        pkg,
      },
      {
        item: makeEvidenceItem({
          itemId: "high",
          subjectId: "sp-1",
          evidenceType: "injury_status",
          direction: "negative",
          confidence: 0.9,
          observedAt: "2026-07-19T12:02:00.000Z",
        }),
        pkg,
      },
    ];

    const deduped = deduplicateItems(active);
    expect(deduped).toHaveLength(1);
    expect(deduped[0]?.item.itemId).toBe("high");
  });
});

describe("weightItems", () => {
  it("applies source weight and provider confidence", () => {
    const pkg = makeEvidencePackage({
      packageId: "pkg-weight",
      sourceId: "news-ap",
      providerConfidence: 0.8,
      items: [],
    });

    const weighted = weightItems(
      [{ item: makeEvidenceItem({ itemId: "i-1", subjectId: "sp-1", confidence: 0.5 }), pkg }],
      mockRegistry,
      Date.parse("2026-07-19T12:05:00.000Z"),
    );

    expect(weighted[0]?.effectiveConfidence).toBeGreaterThan(0);
    expect(weighted[0]?.effectiveConfidence).toBeLessThan(0.5);
  });
});

describe("resolveConflicts", () => {
  it("flags opposing injury directions and prefers higher confidence", () => {
    const pkgA = makeEvidencePackage({ packageId: "pkg-a", sourceId: "news-ap", items: [] });
    const pkgB = makeEvidencePackage({ packageId: "pkg-b", sourceId: "news-espn", items: [] });
    const weighted = weightItems(
      [
        {
          item: makeEvidenceItem({
            itemId: "pos",
            subjectId: "sp-1",
            evidenceType: "injury_status",
            direction: "positive",
            confidence: 0.9,
          }),
          pkg: pkgA,
        },
        {
          item: makeEvidenceItem({
            itemId: "neg",
            subjectId: "sp-1",
            evidenceType: "injury_status",
            direction: "negative",
            confidence: 0.4,
          }),
          pkg: pkgB,
        },
      ],
      mockRegistry,
      Date.parse("2026-07-19T12:05:00.000Z"),
    );

    const { items, conflicts } = resolveConflicts(weighted);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]?.resolution).toBe("higher_confidence");
    expect(items.some((item) => item.itemId === "pos")).toBe(true);
    expect(items.some((item) => item.itemId === "neg")).toBe(false);
  });
});

describe("fuseEvidence", () => {
  it("returns deterministic bundle for fixed packages", () => {
    const packages = [
      makeEvidencePackage({
        packageId: "pkg-1",
        sourceId: "news-ap",
        items: [
          makeEvidenceItem({
            itemId: "news-1",
            subjectId: "sp-1",
            evidenceType: "practice_report",
            direction: "positive",
            confidence: 0.85,
          }),
        ],
      }),
      makeEvidencePackage({
        packageId: "pkg-2",
        sourceId: "social-reddit",
        items: [
          makeEvidenceItem({
            itemId: "social-1",
            subjectId: "sp-2",
            evidenceType: "social_sentiment",
            direction: "positive",
            confidence: 0.7,
          }),
        ],
      }),
      makeEvidencePackage({
        packageId: "pkg-3",
        sourceId: "sportsbook-dk",
        items: [
          makeEvidenceItem({
            itemId: "book-1",
            subjectId: "game-1",
            subjectType: "game",
            evidenceType: "line_movement",
            direction: "neutral",
            confidence: 0.88,
          }),
        ],
      }),
    ];

    const first = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    const second = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });

    expect(first.bundle).toEqual(second.bundle);
    expect(first.bundle.version).toBe("fusion-1.0");
    expect(first.bundle.subjects.length).toBeGreaterThanOrEqual(3);
  });

  it("INT-4: records conflict for opposing injury statuses", () => {
    const packages = [
      makeEvidencePackage({
        packageId: "pkg-pos",
        sourceId: "news-ap",
        items: [
          makeEvidenceItem({
            itemId: "inj-pos",
            subjectId: "sp-kelce",
            evidenceType: "injury_status",
            direction: "positive",
            claim: "Expected to play",
            confidence: 0.82,
          }),
        ],
      }),
      makeEvidencePackage({
        packageId: "pkg-neg",
        sourceId: "news-espn",
        items: [
          makeEvidenceItem({
            itemId: "inj-neg",
            subjectId: "sp-kelce",
            evidenceType: "injury_status",
            direction: "negative",
            claim: "Doubtful",
            confidence: 0.78,
          }),
        ],
      }),
    ];

    const { bundle, metrics } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    const subject = getFusedSubject(bundle, "sp-kelce");
    expect(subject).toBeDefined();
    expect(subject?.conflicts.length).toBeGreaterThan(0);
    expect(metrics.conflictCount).toBeGreaterThan(0);
    expect(bundle.degradationNotes.some((note) => note.includes("conflict"))).toBe(true);
  });

  it("retains provenance via sourceCoverage and supportingRefs", () => {
    const packages = [
      makeEvidencePackage({
        packageId: "pkg-prov",
        sourceId: "news-ap",
        items: [
          makeEvidenceItem({
            itemId: "prov-1",
            subjectId: "sp-1",
            evidenceType: "game_status",
            confidence: 0.91,
          }),
        ],
      }),
    ];

    const { bundle } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    const subject = bundle.subjects[0];
    expect(subject?.sourceCoverage).toContain("news-ap");
    expect(subject?.items[0]?.supportingRefs?.length).toBeGreaterThan(0);
  });

  it("returns empty bundle with degradation notes when all packages invalid", () => {
    const { bundle } = fuseEvidence({
      packages: [makeEvidencePackage({ packageId: "", sourceId: "bad" })],
      registry: mockRegistry,
      context: fusionContext,
    });

    expect(bundle.subjects).toEqual([]);
    expect(bundle.platformConfidence).toBe(0);
    expect(bundle.degradationNotes.length).toBeGreaterThan(0);
  });

  it("applies single-source confidence reduction", () => {
    const packages = [
      makeEvidencePackage({
        packageId: "pkg-single",
        sourceId: "news-ap",
        items: [
          makeEvidenceItem({
            itemId: "single-1",
            subjectId: "sp-single",
            evidenceType: "injury_status",
            confidence: 0.8,
          }),
        ],
      }),
    ];

    const { bundle } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    const subject = getFusedSubject(bundle, "sp-single");
    expect(subject?.fusedConfidence).toBeLessThan(0.8);
  });

  it("getFusedSubject returns undefined for missing subject", () => {
    const { bundle } = fuseEvidence({ packages: [], registry: mockRegistry, context: fusionContext });
    expect(getFusedSubject(bundle, "missing")).toBeUndefined();
  });
});

describe("multi-provider fusion matrix", () => {
  function providerPackage(provider: string, itemId: string, subjectId: string, type: AdiEvidenceItem["evidenceType"]) {
    return makeEvidencePackage({
      packageId: `${provider}-pkg`,
      sourceId: `${provider}-source`,
      metadata: { providerId: provider },
      items: [
        makeEvidenceItem({
          itemId,
          subjectId,
          evidenceType: type,
          confidence: 0.75,
        }),
      ],
    });
  }

  it("fuses 3 providers successfully", () => {
    const packages = [
      providerPackage("news", "n1", "sp-1", "injury_status"),
      providerPackage("social", "s1", "sp-2", "social_sentiment"),
      providerPackage("sportsbook", "b1", "game-1", "line_movement"),
    ];

    const { bundle } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    expect(bundle.subjects.length).toBe(3);
    expect(bundle.platformConfidence).toBeGreaterThan(0);
  });

  it("fuses 5 providers successfully", () => {
    const packages = [
      providerPackage("news", "n1", "sp-1", "injury_status"),
      providerPackage("social", "s1", "sp-2", "social_sentiment"),
      providerPackage("sportsbook", "b1", "game-1", "line_movement"),
      providerPackage("consensus", "c1", "sp-3", "consensus_projection"),
      providerPackage("dfs_content", "d1", "sp-4", "chalk_probability"),
    ];

    const { bundle } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    expect(bundle.subjects.length).toBe(5);
  });

  it("fuses all 7 providers successfully", () => {
    const packages = [
      providerPackage("news", "n1", "sp-1", "injury_status"),
      providerPackage("social", "s1", "sp-2", "social_sentiment"),
      providerPackage("sportsbook", "b1", "game-1", "line_movement"),
      providerPackage("consensus", "c1", "sp-3", "consensus_projection"),
      providerPackage("dfs_content", "d1", "sp-4", "chalk_probability"),
      providerPackage("betting", "t1", "sp-5", "sharp_indicator"),
      providerPackage("historical_learning", "h1", "meta-1", "source_reliability"),
    ];

    const { bundle } = fuseEvidence({ packages, registry: mockRegistry, context: fusionContext });
    expect(bundle.subjects.length).toBe(7);
  });
});
