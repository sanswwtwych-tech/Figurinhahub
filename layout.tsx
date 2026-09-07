import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sticker AI - Crie Figurinhas com Inteligência Artificial",
  description: "Gere, edite e exporte figurinhas estáticas e animadas com IA. Text-to-sticker, image-to-sticker, editor avançado e suporte a GIF.",
  keywords: ["sticker", "figurinha", "IA", "AI", "GIF", "WhatsApp", "Telegram"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
