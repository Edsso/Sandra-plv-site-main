import { getProducts } from "@/lib/products";
import { getStoreContact } from "@/lib/store-settings";
import { ProductCard } from "@/components/site/product-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading } from "@/components/ui/heading";

export async function ProductsSection() {
  const [result, contact] = await Promise.all([getProducts(), getStoreContact()]);

  return (
    <section
      id="produtos"
      className="scroll-mt-(--header-height) border-t border-line"
      aria-labelledby="produtos-titulo"
    >
      <Container className="py-16 md:py-24">
        <Eyebrow tone="teal">Catálogo</Eyebrow>
        <Heading level={2} id="produtos-titulo" className="mt-3 text-navy">
          Produtos
        </Heading>
        <p className="mt-3 max-w-[52ch] text-ink-soft">
          Escolha o produto e peça pelo WhatsApp. Preços sujeitos a alteração.
        </p>

        {result.status === "ok" && result.products.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {result.products.map((product) => (
              <ProductCard key={product.id} product={product} whatsappNumber={contact.whatsappNumber} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-surface border border-dashed border-line bg-mist p-8 text-center">
            <p className="font-medium text-ink">
              {result.status === "ok"
                ? "Os produtos estão sendo cadastrados."
                : "Não foi possível carregar os produtos agora."}
            </p>
            {contact.whatsappUrl ? (
              <>
                <p className="mt-2 text-sm text-ink-soft">Fale com a gente pelo WhatsApp para ver o que tem hoje.</p>
                <Button href={contact.whatsappUrl} tone="whatsapp" pill className="mt-5">
                  Pedir pelo WhatsApp
                </Button>
              </>
            ) : null}
          </div>
        )}
      </Container>
    </section>
  );
}
