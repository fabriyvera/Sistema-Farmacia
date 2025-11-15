import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Catefarm",
  description: "Sistema para cadena de farmacias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen flex flex-col">

        {/* contenido general */}
        <main className="flex-1">
          {children}
        </main>

        {/* barra inferior SIEMPRE visible */}
        <nav className="w-full h-16 border-t bg-white flex items-center justify-around shadow-md">
          <a href="./HomeView" className="font-medium">Inicio</a>
          <a href="./Categorias" className="font-medium">Categorías</a>
          <a href="./Buscar" className="font-medium">Buscar</a>
          <a href="./Configuracion" className="font-medium">Configuración</a>
        </nav>

      </body>
    </html>
  );
}
