import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" && "text-center",
        className,
      )}
    >
      <div className={cn("accent-line mb-4", align === "center" && "mx-auto")} />
      <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-text-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
