import { getStoreContact } from "@/lib/store-settings";
import { WhatsAppMark } from "@/components/site/whatsapp-mark";

export async function WhatsAppFloat() {
  const { whatsappUrl } = await getStoreContact();
  if (!whatsappUrl) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pedir pelo WhatsApp (abre em nova aba)"
      className="fixed right-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white shadow-float transition-colors duration-200 ease-out hover:bg-whatsapp-deep"
    >
      <WhatsAppMark white />
      WhatsApp
    </a>
  );
}
