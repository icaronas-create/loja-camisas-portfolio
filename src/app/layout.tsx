import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo_Black, Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CarrinhoProvider } from "@/lib/cart-context";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-condensed",
  weight: ["500", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-tech",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pratas da Casa",
  description: "Camisas de time de brechó",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${archivoBlack.variable} ${oswald.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f1010]">
        <CarrinhoProvider>
          <Header />
          {children}
        </CarrinhoProvider>
      </body>
    </html>
  );
}