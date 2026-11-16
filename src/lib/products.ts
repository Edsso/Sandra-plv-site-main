import "server-only";
import { supabaseConfig, supabaseSelect } from "@/lib/supabase";

type ProductRow = {
  id: number;
  name: string;
  price: number | string;
  category: string | null;
  image_path: string | null;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string | null;
  /** URL pública da foto no bucket "products", ou null sem foto. */
  imageUrl: string | null;
};

/**
 * Monta a URL pública da foto. Aceita o que costuma ser colado no painel:
 * "12-abc.webp", "products/12-abc.webp" ou a URL pública inteira do bucket.
 */
function productImageUrl(baseUrl: string, path: string | null) {
  const value = path?.trim();
  if (!value) return null;

  const publicBase = `${baseUrl}/storage/v1/object/public/products/`;
  if (/^https?:\/\//.test(value)) return value.startsWith(publicBase) ? value : null;

  const clean = value.replace(/^\/+/, "").replace(/^products\//, "");
  return publicBase + clean.split("/").map(encodeURIComponent).join("/");
}

export type ProductsResult =
  | { status: "ok"; products: Product[] }
  | { status: "unconfigured" }
  | { status: "error" };

/** Produtos ativos, na ordem definida no painel. Nunca derruba a página. */
export async function getProducts(): Promise<ProductsResult> {
  const config = supabaseConfig();
  if (!config) return { status: "unconfigured" };

  try {
    const rows = await supabaseSelect<ProductRow>(
      "products",
      "select=id,name,price,category,image_path&active=eq.true&order=sort_order.asc,name.asc",
      { tags: ["products"] },
    );
    const products = rows.map((row) => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      category: row.category,
      imageUrl: productImageUrl(config.url, row.image_path),
    }));
    return { status: "ok", products };
  } catch (error) {
    console.error("[products]", error);
    return { status: "error" };
  }
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number) {
  return brl.format(value);
}
