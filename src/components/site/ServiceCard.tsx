import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { parseFeatures, priceLabel, cn } from "@/lib/utils";

type Props = {
  service: {
    slug: string;
    name: string;
    blurb: string;
    icon: string;
    priceFrom: number | null;
    priceUnit: string;
    features: string;
    category: string;
  };
  className?: string;
};

export function ServiceCard({ service, className }: Props) {
  const features = parseFeatures(service.features).slice(0, 3);

  return (
    <Link
      href={`/services#${service.slug}`}
      className={cn(
        "group relative flex flex-col rounded-card border border-border-base bg-surface p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:border-lake-300 hover:shadow-e2",
        "dark:hover:border-lake-800",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-xl bg-lake-50 text-lake-700 transition-colors group-hover:bg-lake-100 dark:bg-lake-950 dark:text-lake-300">
        <Icon name={service.icon} className="size-[1.35rem]" />
      </span>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-text">
        {service.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
        {service.blurb}
      </p>

      {features.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {features.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-text-muted">
              <Icon
                name="check"
                className="mt-0.5 size-3.5 shrink-0 text-pine-600 dark:text-pine-400"
              />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border-base pt-4">
        <span className="text-sm font-medium text-text">
          {priceLabel(service.priceFrom, service.priceUnit)}
        </span>
        <Icon
          name="arrow"
          className="size-4 text-text-subtle transition-transform duration-300 group-hover:translate-x-1 group-hover:text-lake-700 dark:group-hover:text-lake-300"
        />
      </div>
    </Link>
  );
}
