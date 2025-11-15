"use client";
import HomeView from "./cliente/page";
import { Product } from "@/types/reservas";

export default function Page() {
  const handleSelectProduct = (product: Product) => {
    console.log("Producto seleccionado:", product);
  };

  return <HomeView onSelectProduct={handleSelectProduct} />;
}
