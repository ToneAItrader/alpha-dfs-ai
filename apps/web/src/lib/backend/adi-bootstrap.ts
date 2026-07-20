import { registerAdiEvidenceProviders } from "@alpha-dfs/adi-platform";
import { createAllEvidenceProviders } from "@alpha-dfs/adi-providers";

let bootstrapped = false;

/** Register ADI evidence providers once per process (M5). */
export function ensureAdiProvidersRegistered(): void {
  if (bootstrapped) {
    return;
  }
  registerAdiEvidenceProviders(createAllEvidenceProviders());
  bootstrapped = true;
}

export function resetAdiBootstrap(): void {
  bootstrapped = false;
}
