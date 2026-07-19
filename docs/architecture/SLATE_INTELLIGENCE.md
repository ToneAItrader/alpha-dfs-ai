# Slate Intelligence

**Status:** Task 9.2 — Architecture complete  
**Version:** 1.0  
**Date:** 2026-07-18  
**Parent:** [PHASE_1_5_ENHANCEMENT_CHARTER.md](../PHASE_1_5_ENHANCEMENT_CHARTER.md)

> Slate-wide analysis before player evaluation — determines optimization strategy for the entire slate.

**Agent:** Slate Intelligence Agent (21) · **Model:** GPT-5.5

---

## Pipeline position

```text
Download Data → SLATE INTELLIGENCE → Intelligence Agents → ...
```

Runs **first** after data ingest — provides context for all downstream agents and Dynamic Portfolio Strategy.

---

## Responsibilities

Evaluate slate-level characteristics:

| Factor | Description |
|--------|-------------|
| Overall slate volatility | High-scoring vs defensive week expected |
| Injury landscape | Count/severity of questionable players on slate |
| Weather impact | Number of outdoor games with adverse conditions |
| Ownership concentration | Expected chalk concentration |
| Value distribution | Salary inefficiencies — many punts vs balanced |
| Viable stacks | High-total games suitable for stacking |
| Scoring environment | Implied totals distribution across slate |

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Slate Grade | 0–100 | Overall slate playability / opportunity |
| Volatility Score | 0–100 | Expected outcome variance slate-wide |
| Recommended Strategy | Enum | `balanced` · `primary_heavy` · `gpp_heavy` · `contrarian` · `stack_aggressive` |
| Confidence Rating | 0–1 | Certainty in slate assessment |

### Recommended Strategy definitions

| Strategy | When | PIE effect |
|----------|------|------------|
| `balanced` | Default — normal slate | Standard Primary/Hail Mary weights |
| `primary_heavy` | Low volatility, clear value | Increase Primary emphasis, tighter exposure |
| `gpp_heavy` | High volatility, condensed ownership | Increase Hail Mary leverage weights |
| `contrarian` | Extreme chalk concentration | Lower ownership tolerance in Hail Mary |
| `stack_aggressive` | Multiple high-total games | Require stacks, game stack bonuses |

---

## Influences

| Consumer | Use |
|----------|-----|
| Dynamic Portfolio Strategy (9.3) | PIE parameter selection |
| Portfolio Simulation | Distribution spread |
| Slate Intelligence Panel (UI) | Task 10 display |
| Contest Strategy Agent | Strategy profile override |

---

## Agent specification

See [AGENTS.md](../AGENTS.md) — Agent 21 Slate Intelligence

---

## Related documents

- [PORTFOLIO_INTELLIGENCE_ENGINE.md](./PORTFOLIO_INTELLIGENCE_ENGINE.md) — Dynamic Strategy
- [PREDICTION_CONFIDENCE_ENGINE.md](../PREDICTION_CONFIDENCE_ENGINE.md)
