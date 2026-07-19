import { dashboardPlaceholderData } from "@/config/dashboard-placeholders";
import { SummaryCard } from "@/components/ui/SummaryCard";

type SummaryCardsProps = {
  cards?: typeof dashboardPlaceholderData.summaryCards;
};

export function SummaryCards({ cards = dashboardPlaceholderData.summaryCards }: SummaryCardsProps) {
  return (
    <section aria-label="Summary cards">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Summary
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <SummaryCard
            key={card.id}
            label={card.label}
            value={card.value}
            hint={card.hint}
          />
        ))}
      </div>
    </section>
  );
}
