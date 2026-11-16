/**
 * Identidade da loja (nome, textos, logo).
 * Contatos reais (WhatsApp, e-mail, redes) ficam no banco, na tabela
 * "store_settings": veja src/lib/store-settings.ts.
 */

export const store = {
  name: "Sandra Produtos de Limpeza e Variedades",
  shortName: "Sandra Produtos de Limpeza e Variedades",
  tagline: "Produtos de limpeza e Variedades para casa e empresa",
  description:
    "Loja de produtos de limpeza e variedades para casa e empresa. Veja os produtos e peça pelo WhatsApp.",
  seo: {
    defaultTitle: "Sandra | Produtos de limpeza",
    titleTemplate: "%s | Sandra",
  },
  /** Mensagem que já vem escrita ao abrir o WhatsApp pelos botões gerais. */
  whatsappMessage: "Olá! Vim pelo site e quero fazer um pedido.",
  assets: {
    logo: "/brand/logo.png",
    logoWidth: 1200,
    logoHeight: 543,
  },
} as const;

/** Links do menu. Âncoras da home: cada seção nova entra aqui. */
export const nav = [
  { href: "/#inicio", label: "Início" },
  { href: "/#produtos", label: "Produtos" },
  { href: "/#contato", label: "Contato" },
] as const;
