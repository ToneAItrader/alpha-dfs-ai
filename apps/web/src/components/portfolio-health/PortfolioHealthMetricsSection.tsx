import { Card } from "@/components/ui/Card";
import { DetailGrid } from "@/components/ui/DetailGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatOptionalNumber,
  formatOptionalText,
  formatSalary,
} from "@/lib/format-display";
import type { PortfolioHealthViewModel } from "@/types/portfolio-health-view-model";

type ExposureBalanceSectionProps = {
  data: PortfolioHealthViewModel["exposure"];
};

export function ExposureBalanceSection({ data }: ExposureBalanceSectionProps) {
  return (
    <section aria-label="Exposure balance">
      <SectionHeading title="Exposure Balance" />
      <Card>
        <DetailGrid
          columns={3}
          items={[
            { label: "QB Exposure", value: formatOptionalText(data.qbExposure) },
            { label: "RB Exposure", value: formatOptionalText(data.rbExposure) },
            { label: "WR Exposure", value: formatOptionalText(data.wrExposure) },
            { label: "TE Exposure", value: formatOptionalText(data.teExposure) },
            { label: "DST Exposure", value: formatOptionalText(data.dstExposure) },
          ]}
        />
      </Card>
    </section>
  );
}

type StackDiversitySectionProps = {
  data: PortfolioHealthViewModel["diversity"];
};

export function StackDiversitySection({ data }: StackDiversitySectionProps) {
  return (
    <section aria-label="Stack diversity">
      <SectionHeading title="Stack Diversity" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Number of Stacks", value: formatOptionalNumber(data.numberOfStacks) },
            { label: "Team Diversity", value: formatOptionalText(data.teamDiversity) },
            { label: "Opponent Diversity", value: formatOptionalText(data.opponentDiversity) },
            { label: "Correlation Score", value: formatOptionalText(data.correlationScore) },
          ]}
        />
      </Card>
    </section>
  );
}

type OwnershipDistributionSectionProps = {
  data: PortfolioHealthViewModel["ownership"];
};

export function OwnershipDistributionSection({ data }: OwnershipDistributionSectionProps) {
  return (
    <section aria-label="Ownership distribution">
      <SectionHeading title="Ownership Distribution" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            {
              label: "Average Ownership",
              value: formatOptionalNumber(data.averageOwnership, "%"),
            },
            { label: "Chalk Exposure", value: formatOptionalText(data.chalkExposure) },
            {
              label: "Contrarian Exposure",
              value: formatOptionalText(data.contrarianExposure),
            },
            { label: "Leverage Balance", value: formatOptionalText(data.leverageBalance) },
          ]}
        />
      </Card>
    </section>
  );
}

type SalaryDistributionSectionProps = {
  data: PortfolioHealthViewModel["salary"];
};

export function SalaryDistributionSection({ data }: SalaryDistributionSectionProps) {
  return (
    <section aria-label="Salary distribution">
      <SectionHeading title="Salary Distribution" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            {
              label: "Average Salary Used",
              value: formatSalary(data.averageSalaryUsed),
            },
            { label: "Remaining Salary", value: formatSalary(data.remainingSalary) },
            { label: "Salary Efficiency", value: formatOptionalText(data.salaryEfficiency) },
            { label: "Salary Balance", value: formatOptionalText(data.salaryBalance) },
          ]}
        />
      </Card>
    </section>
  );
}

type RiskProfileSectionProps = {
  data: PortfolioHealthViewModel["risk"];
};

export function RiskProfileSection({ data }: RiskProfileSectionProps) {
  return (
    <section aria-label="Risk profile">
      <SectionHeading title="Risk Profile" />
      <Card>
        <DetailGrid
          columns={2}
          items={[
            { label: "Overall Risk", value: formatOptionalText(data.overallRisk) },
            { label: "Floor", value: formatOptionalNumber(data.floor) },
            { label: "Ceiling", value: formatOptionalNumber(data.ceiling) },
            { label: "Variance", value: formatOptionalText(data.variance) },
          ]}
        />
      </Card>
    </section>
  );
}

type MultiLineupExposureSectionProps = {
  data: PortfolioHealthViewModel["exposureSummary"];
};

export function MultiLineupExposureSection({ data }: MultiLineupExposureSectionProps) {
  if (data.playerExposures.length === 0 && data.warnings.length === 0) {
    return null;
  }

  const topPlayers = data.playerExposures.slice(0, 3);
  const topTeams = data.teamExposures.slice(0, 3);
  const topStacks = data.stackExposures.slice(0, 2);

  return (
    <section aria-label="Multi-lineup exposure">
      <SectionHeading title="Multi-Lineup Exposure" />
      <Card className="space-y-4">
        <DetailGrid
          columns={2}
          items={[
            {
              label: "Salary Flexibility",
              value:
                data.salaryFlexibilityPct !== null
                  ? `${data.salaryFlexibilityPct.toFixed(1)}%`
                  : "—",
            },
            {
              label: "Top Player Exposure",
              value: topPlayers[0]
                ? `${topPlayers[0].name} (${topPlayers[0].exposurePct}%)`
                : "—",
            },
            {
              label: "Top Team Exposure",
              value: topTeams[0] ? `${topTeams[0].team} (${topTeams[0].exposurePct}%)` : "—",
            },
            {
              label: "Top Stack Exposure",
              value: topStacks[0]
                ? `${topStacks[0].gameId} (${topStacks[0].exposurePct}%)`
                : "—",
            },
          ]}
        />
        {data.warnings.length > 0 ? (
          <ul className="space-y-1 text-sm text-muted">
            {data.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        ) : null}
      </Card>
    </section>
  );
}
