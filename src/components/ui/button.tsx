import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  tone?: "brand" | "navy" | "whatsapp" | "ghost";
  href?: string;
  children: ReactNode;
  pill?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const tones = {
  brand: "bg-brand text-on-brand hover:bg-navy",
  navy: "bg-navy text-on-brand hover:bg-brand",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-deep",
  ghost: "border border-line bg-transparent text-ink hover:bg-mist",
} as const;

export function Button({
  tone = "brand",
  href,
  children,
  pill = false,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = `inline-flex h-12 items-center justify-center gap-2 px-5 text-[15px] font-medium transition-colors duration-200 ease-out disabled:cursor-wait disabled:opacity-70 ${tones[tone]} ${pill ? "rounded-full" : "rounded-surface"} ${className}`;

  if (!href) {
    return (
      <button type={type} className={classes} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
