import Image from "next/image";
import Link from "next/link";
import { nav, store } from "@/content/store";
import { getStoreContact } from "@/lib/store-settings";
import { HeaderShell } from "@/components/site/header-shell";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";
import { Container } from "@/components/ui/container";

export async function Header() {
  const contact = await getStoreContact();

  return (
    <HeaderShell>
      <Container className="flex h-(--header-height) items-center justify-between gap-6">
        <Link href="/#inicio" className="flex shrink-0 items-center" aria-label={`${store.name}, início`}>
          <Image
            src={store.assets.logo}
            alt={store.name}
            width={store.assets.logoWidth}
            height={store.assets.logoHeight}
            className="h-12 w-auto md:h-14"
            sizes="130px"
            priority
            draggable={false}
          />
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <nav aria-label="Principal" className="hidden items-center gap-6 sm:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
          {contact.whatsappUrl ? (
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-4 text-sm font-semibold text-on-brand transition-colors duration-200 ease-out hover:bg-navy"
            >
              <WhatsAppMark white />
              <span>
                Fazer pedido<span className="sr-only"> pelo WhatsApp (abre em nova aba)</span>
              </span>
            </a>
          ) : null}
        </div>
      </Container>
    </HeaderShell>
  );
}
