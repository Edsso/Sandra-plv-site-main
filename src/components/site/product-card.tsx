import { whatsappLink } from "@/content/store";
import { formatPrice, type Product } from "@/lib/products";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";

export function ProductCard({ product }: { product: Product }) {
  const price = formatPrice(product.price);
  const orderUrl = whatsappLink(`Olá! Quero pedir: ${product.name} (${price}).`);

  return (
    <li className="product-card">
      {/* Espaço da foto: a imagem entra no próximo passo (Supabase Storage). */}
      <div className="product-thumb" aria-hidden="true">
        <span>{product.name.charAt(0)}</span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.category ? (
          <p className="text-[11px] font-semibold tracking-[0.12em] text-teal uppercase">{product.category}</p>
        ) : null}
        <h3 className="mt-1 text-[15px] leading-snug font-semibold text-ink">{product.name}</h3>
        <p className="mt-auto pt-3 text-xl font-semibold text-navy tabular-nums">{price}</p>
        <a
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium text-ink transition-colors duration-200 ease-out hover:border-whatsapp hover:bg-whatsapp hover:text-white"
        >
          <WhatsAppMark />
          Pedir<span className="sr-only"> {product.name} pelo WhatsApp (abre em nova aba)</span>
        </a>
      </div>
    </li>
  );
}
