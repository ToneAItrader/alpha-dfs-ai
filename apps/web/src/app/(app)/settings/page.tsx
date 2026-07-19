import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShellPlaceholder } from "@/components/layout/ShellPlaceholder";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Data source configuration and contest preferences."
      />
      <ShellPlaceholder
        title="Settings shell ready"
        description="Configuration controls will be added in a future task."
      />
    </div>
  );
}
