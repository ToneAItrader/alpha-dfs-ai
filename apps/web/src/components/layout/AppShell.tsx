"use client";

import { Header } from "@/components/layout/Header";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { MobileNavProvider, useMobileNav } from "@/components/layout/MobileNavContext";
import { PipelineStatusProvider, usePipelineStatus } from "@/providers/pipeline-status-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/cn";

type AppShellProps = {
  children: React.ReactNode;
};

function AppShellContent({ children }: AppShellProps) {
  const { open } = useMobileNav();
  const { analysisStatus } = usePipelineStatus();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header analysisStatus={analysisStatus} />
        <main
          id="main-content"
          aria-hidden={open || undefined}
          className={cn(
            "flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8",
            open && "max-lg:invisible",
          )}
        >
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

      <MobileNavDrawer />
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  return (
    <MobileNavProvider>
      <PipelineStatusProvider>
        <AppShellContent>{children}</AppShellContent>
      </PipelineStatusProvider>
    </MobileNavProvider>
  );
}
