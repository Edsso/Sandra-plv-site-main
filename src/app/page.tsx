import { store } from "@/content/store";
import { ProductsSection } from "@/components/site/products-section";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading } from "@/components/ui/heading";

/** Regera a página com os produtos do banco a cada 5 minutos (ISR). */
export const revalidate = 300;

export default function HomePage() {
  return (
    <>
      <section id="inicio" className="scroll-mt-(--header-height) bg-brand-soft">
        <Container className="grid min-h-[44svh] content-center py-16 md:py-20">
          <Eyebrow tone="teal">{store.tagline}</Eyebrow>
          <Heading level={1} className="mt-4 max-w-[18ch] text-navy">
            Tudo para deixar a casa e a empresa limpas
          </Heading>
          <p className="mt-5 max-w-[48ch] text-lg text-ink-soft">{store.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#produtos" pill>
              Ver produtos
            </Button>
            <Button href={store.contact.whatsappUrl} tone="whatsapp" pill>
              <WhatsAppMark white />
              Pedir pelo WhatsApp
            </Button>
          </div>
        </Container>
      </section>

      <ProductsSection />
    </>
  );
}
