import "server-only";
import { supabaseConfig, supabaseSelect } from "@/lib/supabase";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string | null;
  image_path: string | null;
};

export type ProductsResult =
  | { status: "ok"; products: Product[] }
  | { status: "unconfigured" }
  | { status: "error" };

/** Produtos ativos, na ordem definida no painel. Nunca derruba a página. */
export async function getProducts(): Promise<ProductsResult> {
  if (!supabaseConfig()) return { status: "unconfigured" };

  try {
    const products = await supabaseSelect<Product>(
      "products",
      "select=id,name,price,category,image_path&active=eq.true&order=sort_order.asc,name.asc",
      { tags: ["products"] },
    );
    return { status: "ok", products: products.map((p) => ({ ...p, price: Number(p.price) })) };
  } catch (error) {
    console.error("[products]", error);
    return { status: "error" };
  }
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatPrice(value: number) {
  return brl.format(value);
}
