import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "header" | "hero" | "footer";
  showText?: boolean;
}

const variantClasses = {
  header: "h-12 w-auto sm:h-14",
  hero: "h-52 w-auto sm:h-64 md:h-80 lg:h-[22rem]",
  footer: "h-9 w-auto",
};

export function Logo({
  className,
  variant = "header",
  showText = true,
}: LogoProps) {
  const image = (
    <img
      src="/assets/logo.svg"
      alt="SemTalento Studio"
      className={cn(
        "block object-contain object-center",
        variantClasses[variant],
      )}
    />
  );

  if (!showText) {
    return <div className={cn("flex items-center justify-center", className)}>{image}</div>;
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {image}
      <span className="font-display text-lg font-medium tracking-tight text-text sm:text-xl">
        SemTalento<span className="text-brand"> Studio</span>
      </span>
    </div>
  );
}
