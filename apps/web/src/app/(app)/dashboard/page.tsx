import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { AnalyzeSlateButton } from "@/components/dashboard/AnalyzeSlateButton";
import { AnalysisOverview } from "@/components/dashboard/AnalysisOverview";
import { DashboardStatusBar } from "@/components/dashboard/DashboardStatusBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { getAnalysisProvider } from "@/providers/analysis-provider";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "DraftKings NFL Classic slate analysis dashboard — Analyze Slate and portfolio overview.",
};

export default async function DashboardPage() {
  const dashboardData = await getAnalysisProvider().getDashboardData();

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <PageHeader
        title="Dashboard"
        description="Primary operational view for DraftKings NFL Classic slate analysis."
      />

      <DashboardStatusBar data={dashboardData} />

      <AnalyzeSlateButton />

      <SummaryCards cards={dashboardData.summaryCards} />

      <AnalysisOverview />

      <RecentActivity items={dashboardData.recentActivity} />

      <AppFooter />
    </div>
  );
}
