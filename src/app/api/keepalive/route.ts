import { supabaseConfig } from "@/lib/supabase";

/**
 * Chamada 1x por dia pelo Cron da Vercel (vercel.json) para o projeto
 * Supabase do plano grátis não pausar por falta de uso.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const config = supabaseConfig();
  if (!config) return Response.json({ ok: false, reason: "unconfigured" }, { status: 503 });

  const response = await fetch(`${config.url}/rest/v1/products?select=id&limit=1`, {
    headers: { apikey: config.key, Authorization: `Bearer ${config.key}` },
    cache: "no-store",
  });

  return Response.json({ ok: response.ok }, { status: response.ok ? 200 : 502 });
}
