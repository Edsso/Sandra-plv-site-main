-- Contatos da loja (WhatsApp, e-mail, redes).
-- Tabela de UMA linha (id = 1).
-- Edite pelo Table Editor do Supabase; o site atualiza em até 5 minutos.

create table public.store_settings (
  id               smallint primary key default 1 check (id = 1),
  whatsapp_number  text check (whatsapp_number is null or whatsapp_number ~ '^[0-9]{10,15}$'),
  email            text check (email is null or email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  instagram_url    text check (instagram_url is null or instagram_url ~ '^https://'),
  facebook_url     text check (facebook_url is null or facebook_url ~ '^https://'),
  updated_at       timestamptz not null default now()
);

comment on table  public.store_settings                 is 'Contatos exibidos no site. Uma linha só (id = 1).';
comment on column public.store_settings.whatsapp_number is 'Só dígitos: DDD + número (o 55 é opcional). Ex.: 47999998888';
comment on column public.store_settings.email           is 'E-mail exibido no rodapé. Vazio = não aparece.';
comment on column public.store_settings.instagram_url   is 'Link completo, começando com https://. Vazio = não aparece.';
comment on column public.store_settings.facebook_url    is 'Link completo, começando com https://. Vazio = não aparece.';

create trigger store_settings_set_updated_at
before update on public.store_settings
for each row execute function public.set_updated_at();

-- Segurança: a chave pública só LÊ.
alter table public.store_settings enable row level security;

revoke all on public.store_settings from anon, authenticated;
grant select on public.store_settings to anon, authenticated;

create policy "Contatos da loja são públicos"
on public.store_settings
for select
to anon, authenticated
using (true);

-- Linha única, vazia: preencha os dados reais pelo painel, nunca aqui.
insert into public.store_settings (id) values (1);
