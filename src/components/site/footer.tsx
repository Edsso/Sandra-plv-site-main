import Image from "next/image";
import { store } from "@/content/store";
import { SocialLinks } from "@/components/site/social-links";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";
import { Container } from "@/components/ui/container";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contato" className="scroll-mt-(--header-height) border-t border-line bg-mist pb-20">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12">
        <div>
          <Image
            src={store.assets.logo}
            alt={store.name}
            width={store.assets.logoWidth}
            height={store.assets.logoHeight}
            className="h-20 w-auto"
            sizes="180px"
            draggable={false}
          />
          <p className="mt-5 max-w-[38ch] text-sm leading-6 text-ink-soft">{store.description}</p>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">Contato</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={store.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand"
              >
                <WhatsAppMark />
                {store.contact.whatsappDisplay}
                <span className="sr-only">no WhatsApp (abre em nova aba)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${store.contact.email}`} className="text-ink hover:text-brand">
                {store.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">Redes sociais</p>
          <SocialLinks className="mt-4" />
        </div>
      </Container>

      <Container className="border-t border-line py-6">
        <p className="text-[13px] text-ink-soft">
          © {year} {store.name}. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
