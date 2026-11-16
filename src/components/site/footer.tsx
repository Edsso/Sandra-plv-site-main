import Image from "next/image";
import { store } from "@/content/store";
import { getStoreContact } from "@/lib/store-settings";
import { SocialLinks } from "@/components/site/social-links";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";
import { Container } from "@/components/ui/container";

export async function Footer() {
  const contact = await getStoreContact();
  const year = new Date().getFullYear();
  const hasContact = Boolean(contact.whatsappUrl || contact.email);
  const hasSocial = Boolean(contact.instagramUrl || contact.facebookUrl);

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

        {hasContact ? (
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">Contato</p>
            <ul className="mt-4 space-y-3 text-sm">
              {contact.whatsappUrl ? (
                <li>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand"
                  >
                    <WhatsAppMark />
                    {contact.whatsappDisplay}
                    <span className="sr-only">no WhatsApp (abre em nova aba)</span>
                  </a>
                </li>
              ) : null}
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="text-ink hover:text-brand">
                    {contact.email}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}

        {hasSocial ? (
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-teal uppercase">Redes sociais</p>
            <SocialLinks contact={contact} className="mt-4" />
          </div>
        ) : null}
      </Container>

      <Container className="border-t border-line py-6">
        <p className="text-[13px] text-ink-soft">
          © {year} {store.name}. Todos os direitos reservados.
        </p>
      </Container>
    </footer>
  );
}
