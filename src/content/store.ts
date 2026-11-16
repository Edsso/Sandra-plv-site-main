/**
 * Identidade e contato da loja. Fonte única: header, footer, SEO e
 * WhatsApp leem daqui. Campos com TODO esperam o material do cliente.
 */

// TODO: trocar pelo número real (só dígitos, com 55 + DDD).
const whatsappNumber = "5500000000000";
const whatsappMessage = "Olá! Vim pelo site e quero fazer um pedido.";

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
  contact: {
    whatsappNumber,
    // Trocar junto com o número acima.
    whatsappDisplay: "(00) 00000-0000",
    whatsappUrl: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
    // E-mail, Instagram e Facebook reais.
    email: "contato@exemplo.com.br",
    instagramUrl: "https://www.instagram.com/",
    facebookUrl: "https://www.facebook.com/",
  },
  assets: {
    logo: "/brand/logo.png",
    logoWidth: 1200,
    logoHeight: 543,
  },
} as const;

/** Links do menu. Âncoras da home: cada seção nova entra aqui. */
export const nav = [
  { href: "/#inicio", label: "Início" },
  { href: "/#contato", label: "Contato" },
] as const;
