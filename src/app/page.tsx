import { store } from "@/content/store";
import { Container } from "@/components/ui/container";
import { Eyebrow, Heading } from "@/components/ui/heading";

export default function HomePage() {
  return (
    <section className="bg-mist">
      <Container className="grid min-h-[60svh] content-center py-16 md:py-24">
        <Eyebrow tone="brand">{store.tagline}</Eyebrow>
        <Heading level={1} className="mt-4 max-w-[18ch]">
          {store.name}
        </Heading>
        <p className="mt-5 max-w-[48ch] text-lg text-ink-soft">{store.description}</p>
      </Container>
    </section>
  );
}
