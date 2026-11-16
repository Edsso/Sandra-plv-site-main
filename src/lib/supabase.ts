import "server-only";

/**
 * Acesso de leitura ao Supabase pela API REST (PostgREST), com fetch puro:
 * sem SDK, e o cache do Next.js funciona direto no fetch.
 * Aceita os nomes de variável da integração Vercel + Supabase.
 */
export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return { url, key };
}

export async function supabaseSelect<T>(
  table: string,
  query: string,
  init: { revalidate?: number | false; tags?: string[] } = {},
): Promise<T[]> {
  const config = supabaseConfig();
  if (!config) throw new Error("Supabase não configurado (veja .env.example).");

  const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, {
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    next: { revalidate: init.revalidate ?? 300, tags: init.tags },
  });

  if (!response.ok) {
    throw new Error(`Supabase ${table}: ${response.status} ${await response.text()}`);
  }
  return (await response.json()) as T[];
}
