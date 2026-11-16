-- Catálogo de produtos da loja.
-- O site só lê (produtos ativos). Cadastro e edição são feitos pelo
-- Table Editor do Supabase, que usa a conta do painel, não a chave pública.

create table public.products (
  id          bigint generated always as identity primary key,
  name        text          not null check (char_length(name) between 1 and 120),
  price       numeric(10,2) not null check (price >= 0),
  category    text          check (category is null or char_length(category) <= 60),
  image_path  text,          -- caminho no Supabase Storage (próximo passo)
  active      boolean       not null default true,
  sort_order  integer       not null default 0,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

comment on table  public.products            is 'Produtos exibidos no site.';
comment on column public.products.price      is 'Preço em reais, ex.: 12.90';
comment on column public.products.active     is 'Desmarque para esconder o produto do site sem apagar.';
comment on column public.products.sort_order is 'Ordem de exibição: menor aparece primeiro.';

create index products_active_sort_idx on public.products (active, sort_order, name);

-- Atualiza updated_at a cada edição.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Segurança: a chave pública só consegue LER produtos ativos.
alter table public.products enable row level security;

revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;

create policy "Produtos ativos são públicos"
on public.products
for select
to anon, authenticated
using (active);
