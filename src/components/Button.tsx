import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  external?: boolean;
}

const variants = {
  primary:
    "bg-gradient-to-r from-accent to-accent-soft text-surface shadow-lg shadow-accent/20 hover:shadow-accent/35 hover:brightness-105 border border-accent/30",
  secondary:
    "bg-surface-elevated/80 text-text hover:bg-surface-muted border border-border hover:border-brand/30 backdrop-blur-sm",
  ghost: "text-text-muted hover:text-text hover:bg-surface-elevated",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  children,
  className,
  external,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200",
    variants[variant],
    sizes[size],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={false} {...props}>
      {children}
    </Link>
  );
}
