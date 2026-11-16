import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function NotFound() {
  return (
    <Container className="py-24">
      <Heading level={1}>Página não encontrada</Heading>
      <p className="mt-4 max-w-[52ch] text-ink-soft">
        Este endereço não existe no site. Volte ao início para ver os produtos.
      </p>
      <Button href="/" className="mt-8">
        Ir para o início
      </Button>
    </Container>
  );
}
