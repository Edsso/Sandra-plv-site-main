import type { ReactNode } from "react";

const styles = {
  1: "font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance",
  2: "font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance",
  3: "font-display text-[1.25rem] leading-[1.3] font-semibold tracking-[-0.01em] text-balance",
} as const;

export function Eyebrow({
  children,
  tone = "soft",
  className = "",
}: {
  children: ReactNode;
  tone?: "soft" | "brand" | "teal";
  className?: string;
}) {
  const color =
    tone === "brand" ? "text-brand" : tone === "teal" ? "text-teal" : "text-ink-soft";
  return (
    <p className={`text-xs font-semibold tracking-[0.14em] uppercase ${color} ${className}`}>
      {children}
    </p>
  );
}

export function Heading({
  level = 2,
  children,
  className = "",
  id,
}: {
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={`${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}
