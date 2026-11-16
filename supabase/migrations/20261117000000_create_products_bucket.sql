-- Bucket das fotos dos produtos (Supabase Storage).
-- Público para LEITURA pela URL direta do arquivo (o site usa
-- /storage/v1/object/public/products/<arquivo>). Ninguém consegue listar,
-- enviar, trocar ou apagar arquivos com a chave pública: não há policy
-- em storage.objects para anon/authenticated.
-- O envio é feito pelo painel do Supabase ou pelo script
-- `npm run imagens` (chave secreta, só na máquina de quem roda).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products',
  'products',
  true,
  2097152, -- 2 MB por arquivo: o script envia ~50 KB; isso barra foto crua por engano
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
);
