#!/usr/bin/env node
/**
 * Sobe as fotos dos produtos para o Supabase Storage, já comprimidas.
 *
 *   npm run imagens                 → usa a pasta ./fotos
 *   npm run imagens -- outra-pasta  → usa outra pasta
 *   npm run imagens -- --teste      → só mostra o que faria, sem enviar nada
 *
 * Nome do arquivo = qual produto recebe a foto:
 *   12.jpg                          → produto de id 12
 *   detergente-neutro-500-ml.jpg    → produto com esse nome (sem acento, com hífens)
 *
 * Cada foto vira WebP de no máximo 800×800 (≈ 30–80 KB), sobe para o bucket
 * "products" e o caminho é gravado em products.image_path. A foto antiga do
 * produto, se havia, é apagada do bucket.
 *
 * Precisa no .env.local (NUNCA na Vercel nem no git):
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SECRET_KEY=sb_secret_...
 */

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BUCKET = "products";
const MAX_SIZE = 800;
const QUALITY = 80;
const ACCEPTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

const args = process.argv.slice(2);
const dryRun = args.includes("--teste");
const folder = path.resolve(args.find((arg) => !arg.startsWith("--")) ?? "fotos");

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/$/, "");
const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

if (!baseUrl) fail("Falta NEXT_PUBLIC_SUPABASE_URL no .env.local.");
if (!secretKey) {
  fail(
    "Falta SUPABASE_SECRET_KEY no .env.local.\n" +
      "  Crie em: Supabase → Project Settings → API Keys → Secret keys.",
  );
}
if (secretKey.startsWith("sb_publishable_")) {
  fail("SUPABASE_SECRET_KEY está com a chave PUBLICÁVEL. Use a secreta (sb_secret_...).");
}

const headers = { apikey: secretKey, Authorization: `Bearer ${secretKey}` };

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function api(url, init = {}) {
  const response = await fetch(url, { ...init, headers: { ...headers, ...init.headers } });
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response;
}

async function main() {
  let files;
  try {
    files = (await readdir(folder, { withFileTypes: true })).filter((entry) => entry.isFile());
  } catch {
    fail(`Pasta não encontrada: ${folder}\n  Crie a pasta e coloque as fotos nela.`);
  }

  const products = await (
    await api(`${baseUrl}/rest/v1/products?select=id,name,image_path&order=id`)
  ).json();
  const byId = new Map(products.map((product) => [String(product.id), product]));
  const bySlug = new Map(products.map((product) => [slugify(product.name), product]));

  console.log(`\nPasta: ${folder}`);
  console.log(`Produtos no banco: ${products.length}${dryRun ? "  (modo teste: nada será enviado)" : ""}\n`);

  let sent = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;

  for (const file of files) {
    const extension = path.extname(file.name).toLowerCase();
    const stem = path.basename(file.name, path.extname(file.name));

    if (extension === ".heic" || extension === ".heif") {
      console.log(`– ${file.name}: HEIC (iPhone) não é suportado. Exporte como JPG.`);
      skipped++;
      continue;
    }
    if (!ACCEPTED.has(extension)) continue;

    const product = /^\d+$/.test(stem) ? byId.get(stem) : bySlug.get(slugify(stem));
    if (!product) {
      console.log(`– ${file.name}: nenhum produto com id/nome "${stem}". Ignorado.`);
      skipped++;
      continue;
    }

    const original = await readFile(path.join(folder, file.name));
    const webp = await sharp(original)
      .rotate()
      .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toBuffer();

    const hash = createHash("sha1").update(webp).digest("hex").slice(0, 8);
    const objectPath = `${product.id}-${slugify(product.name)}-${hash}.webp`;

    before += original.length;
    after += webp.length;
    const label = `${file.name} → #${product.id} ${product.name}  (${kb(original.length)} → ${kb(webp.length)})`;

    if (product.image_path === objectPath) {
      console.log(`= ${label}: mesma foto já cadastrada.`);
      continue;
    }
    if (dryRun) {
      console.log(`✓ ${label}  [teste]`);
      sent++;
      continue;
    }

    await api(`${baseUrl}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: "POST",
      headers: { "Content-Type": "image/webp", "Cache-Control": "max-age=31536000", "x-upsert": "true" },
      body: webp,
    });

    await api(`${baseUrl}/rest/v1/products?id=eq.${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ image_path: objectPath }),
    });

    const old = product.image_path?.trim().replace(/^products\//, "");
    if (old && !/^https?:\/\//.test(old) && old !== objectPath) {
      await api(`${baseUrl}/storage/v1/object/${BUCKET}/${old}`, { method: "DELETE" }).catch(() => {});
    }

    console.log(`✓ ${label}`);
    sent++;
  }

  console.log(
    `\n${dryRun ? "Seriam enviadas" : "Enviadas"}: ${sent}  ·  Ignoradas: ${skipped}` +
      (sent ? `  ·  Total: ${kb(before)} → ${kb(after)}` : ""),
  );
  if (!dryRun && sent) console.log("O site mostra as fotos novas em até 5 minutos.\n");
}

main().catch((error) => fail(error.message));
