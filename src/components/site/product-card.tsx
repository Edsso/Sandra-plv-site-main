import Image from "next/image";
import { formatPrice, type Product } from "@/lib/products";
import { whatsappLink } from "@/lib/store-settings";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: Product;
  /** Sem número cadastrado, o botão "Pedir" não aparece. */
  whatsappNumber: string | null;
}) {
  const price = formatPrice(product.price);
  const orderUrl = whatsappNumber
    ? whatsappLink(whatsappNumber, `Olá! Quero pedir: ${product.name} (${price}).`)
    : null;

  return (
    <li className="product-card">
      {product.imageUrl ? (
        <div className="product-thumb has-image">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 768px) 33vw, 50vw"
            className="product-photo object-cover"
            draggable={false}
          />
        </div>
      ) : (
        /* Sem foto cadastrada: inicial do produto. */
        <div className="product-thumb" aria-hidden="true">
          <span>{product.name.charAt(0)}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {product.category ? (
          <p className="text-[11px] font-semibold tracking-[0.12em] text-teal uppercase">{product.category}</p>
        ) : null}
        <h3 className="mt-1 text-[15px] leading-snug font-semibold text-ink">{product.name}</h3>
        <p className="mt-auto pt-3 text-xl font-semibold text-navy tabular-nums">{price}</p>
        {orderUrl ? (
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line text-sm font-medium text-ink transition-colors duration-200 ease-out hover:border-whatsapp hover:bg-whatsapp hover:text-white"
          >
            <WhatsAppMark />
            Pedir<span className="sr-only"> {product.name} pelo WhatsApp (abre em nova aba)</span>
          </a>
        ) : null}
      </div>
    </li>
  );
}
