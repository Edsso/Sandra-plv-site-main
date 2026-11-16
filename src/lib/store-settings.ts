import "server-only";
import { cache } from "react";
import { store } from "@/content/store";
import { supabaseConfig, supabaseSelect } from "@/lib/supabase";

type StoreSettingsRow = {
  whatsapp_number: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
};

export type StoreContact = {
  /** Só dígitos, ex.: 5547999998888. */
  whatsappNumber: string | null;
  /** Ex.: (47) 99999-8888. */
  whatsappDisplay: string | null;
  /** Link geral do WhatsApp, com a mensagem padrão. */
  whatsappUrl: string | null;
  email: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
};

const empty: StoreContact = {
  whatsappNumber: null,
  whatsappDisplay: null,
  whatsappUrl: null,
  email: null,
  instagramUrl: null,
  facebookUrl: null,
};

/**
 * Contatos da loja, lidos da tabela "store_settings" (cache de 5 min).
 * `cache` faz header, footer e produtos dividirem a mesma leitura.
 * Se o banco falhar, os links somem em vez de a página quebrar.
 */
export const getStoreContact = cache(async (): Promise<StoreContact> => {
  if (!supabaseConfig()) return empty;

  try {
    const [row] = await supabaseSelect<StoreSettingsRow>(
      "store_settings",
      "select=whatsapp_number,email,instagram_url,facebook_url&id=eq.1",
      { tags: ["store_settings"] },
    );
    if (!row) return empty;

    const number = normalizeWhatsapp(row.whatsapp_number);
    return {
      whatsappNumber: number,
      whatsappDisplay: number ? formatBrazilPhone(number) : null,
      whatsappUrl: number ? whatsappLink(number, store.whatsappMessage) : null,
      email: row.email?.trim() || null,
      instagramUrl: row.instagram_url?.trim() || null,
      facebookUrl: row.facebook_url?.trim() || null,
    };
  } catch (error) {
    console.error("[store_settings]", error);
    return empty;
  }
});

/**
 * Aceita o número com ou sem o 55: "47999998888" e "5547999998888" viram
 * "5547999998888". O wa.me exige o código do país (sem ele, "47" seria
 * lido como código de outro país).
 */
export function normalizeWhatsapp(value: string | null) {
  const digits = value?.replace(/\D/g, "") ?? "";
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits.length >= 12 ? digits : null;
}

/** Link do WhatsApp com a mensagem já escrita. */
export function whatsappLink(number: string, message: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** 5547999998888 -> (47) 99999-8888. Outros formatos voltam como vieram. */
export function formatBrazilPhone(digits: string) {
  const local = digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits;
  const match = local.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : digits;
}
