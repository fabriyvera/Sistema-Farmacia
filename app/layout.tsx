import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Tu Proyecto",
  description: "Descripción de tu app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
