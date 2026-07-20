# @alpha-dfs/adi-providers

V2.2 ADI evidence provider adapters (M5).

## Providers

| ID | Fixture | Priority | Env flag |
|----|---------|----------|----------|
| news | news-seed.json | P0 | `ADI_PROVIDER_NEWS_ENABLED` |
| social | social-seed.json | P1 | `ADI_PROVIDER_SOCIAL_ENABLED` |
| sportsbook | sportsbook-seed.json | P0 | `ADI_PROVIDER_SPORTSBOOK_ENABLED` |
| consensus | consensus-seed.json | P0 | `ADI_PROVIDER_CONSENSUS_ENABLED` |
| dfs_content | dfs-content-seed.json | P1 | `ADI_PROVIDER_DFS_CONTENT_ENABLED` |
| betting | betting-seed.json | P1 | `ADI_PROVIDER_BETTING_ENABLED` |
| historical_learning | historical-seed.json | P2 | `ADI_PROVIDER_HISTORICAL_LEARNING_ENABLED` |

All providers output `AdiEvidencePackage` only (HP-2). Raw fixture JSON never leaves adapter boundaries.

## Usage

```typescript
import { registerAdiEvidenceProviders } from "@alpha-dfs/adi-platform";
import { createAllEvidenceProviders } from "@alpha-dfs/adi-providers";

registerAdiEvidenceProviders(createAllEvidenceProviders());
```

Web app bootstraps via `apps/web/src/lib/backend/adi-bootstrap.ts`.
