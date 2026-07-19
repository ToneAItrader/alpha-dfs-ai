import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AppLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner label="Loading view" size="lg" />
    </div>
  );
}
