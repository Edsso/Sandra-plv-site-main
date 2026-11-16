import type { StoreContact } from "@/lib/store-settings";

/** Ícones das redes. Rede sem link cadastrado no banco não aparece. */
export function SocialLinks({ contact, className = "" }: { contact: StoreContact; className?: string }) {
  const links = [
    { href: contact.instagramUrl, label: "Instagram", icon: InstagramIcon },
    { href: contact.facebookUrl, label: "Facebook", icon: FacebookIcon },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));

  if (links.length === 0) return null;

  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map((item) => (
        <li key={item.label}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label} (abre em nova aba)`}
            className="social-link"
          >
            <item.icon />
          </a>
        </li>
      ))}
    </ul>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.55V4.47A20.6 20.6 0 0 0 14.3 4.35c-2.24 0-3.8 1.37-3.8 3.88v2.27H8v3h2.5V21h3Z"
      />
    </svg>
  );
}
