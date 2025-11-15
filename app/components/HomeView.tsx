"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Product } from "@/types/reservas";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Star, Percent, TrendingUp, Clock } from "lucide-react";
import Image from "next/image";



interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
}

export default function HomeView({ onSelectProduct }: HomeViewProps) {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const convertProductoToProduct = (producto: Producto): Product => ({
    id: producto.id,
    name: producto.name,
    category: producto.categoria,
    price: parseFloat(producto.precio),
    image: producto.imagen,
    stock: parseInt(producto.stock),
    requiresPrescription: producto.recetaRequerida === "Si",
    description: producto.descripcion,
    activeIngredient: producto.descripcion.split(".")[0],
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productos = await apiService.getProductos();
        const products = productos.map(convertProductoToProduct);
        setFeaturedProducts(products.slice(0, 4));
        setDiscountProducts(products.slice(4, 6));
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = [
    { name: "Analgésicos", icon: "💊", color: "bg-red-100 text-red-700" },
    { name: "Vitaminas", icon: "🌿", color: "bg-green-100 text-green-700" },
    { name: "Antibióticos", icon: "🔬", color: "bg-blue-100 text-blue-700" },
    { name: "Digestivos", icon: "🫀", color: "bg-purple-100 text-purple-700" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-8">


      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-orange-600 text-white border-none">
        <CardContent className="p-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Bienvenido a CATEFARM!</h2>
          <p className="text-sm md:text-base text-white/90">
            Tu farmacia de confianza, ahora en tu móvil y desktop
          </p>
        </CardContent>
      </Card>

      {/* Quick Categories */}
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categorías Populares</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`${cat.color} rounded-xl p-4 flex flex-col items-center justify-center text-center transition-transform active:scale-95`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-sm font-medium">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Productos Destacados</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => onSelectProduct(product)}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-primary font-bold">Bs. {product.price.toFixed(2)}</span>
                    {product.requiresPrescription && (
                      <Badge variant="destructive" className="text-xs">
                        Receta
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discount Products */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Percent className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Ofertas Especiales</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => onSelectProduct(product)}
            >
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-primary font-bold">Bs. {product.price.toFixed(2)}</span>
                    <Badge variant="secondary" className="text-xs">
                      -15% OFF
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm mb-1 font-semibold">Reserva</p>
            <p className="text-xs text-muted-foreground">Válida 24 horas</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm mb-1 font-semibold">Retiro</p>
            <p className="text-xs text-muted-foreground">Sin costo</p>
          </CardContent>
        </Card>
      </div>

     <footer className="bg-white border-t border-gray-200 mt-12 text-right">

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {/* Columna 1: Logo alineado */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative w-36 h-36 mb-3">
              <Image src="/logo-catefarm.jpg" alt="Logo CATEFARM" fill style={{ objectFit: "contain" }} />
            </div>
            
            <div className="text-sm text-gray-500">Sistema de gestión</div>
          </div>

          {/* Columna 2: Categorías */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">
              Categorías
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Dermatología</li>
              <li>Farmacia y Salud</li>
              <li>Vitaminas</li>
              <li>Ortopedia</li>
              <li>Suplementos</li>
              <li>Cuidado Personal</li>
            </ul>
          </div>

          {/* Columna 3: Redes sociales */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">
              Contáctanos
            </h4>
            <div className="flex justify-center md:justify-start items-center gap-5">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.14h-1.1c-1.1 0-1.45.68-1.45 1.38V12h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-md text-gray-600 hover:text-pink-500 hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.9A3.1 3.1 0 1015.1 11 3.1 3.1 0 0012 7.9zm6.4-.6a1.15 1.15 0 11-1.15-1.15A1.15 1.15 0 0118.4 7.3zM12 9.6A2.4 2.4 0 1114.4 12 2.4 2.4 0 0112 9.6z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="p-2 rounded-md text-gray-600 hover:text-black hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 8.2c-.3-.1-.7-.2-1-.2v6.3a4.3 4.3 0 11-4.3-4.3V8.1a6.6 6.6 0 006.3.1zM12 21a5 5 0 100-10 5 5 0 000 10z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-md text-gray-600 hover:text-sky-700 hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.98 5.5S1 4.6 1 3.5 1.92 1.5 3 1.5 4.98 2.4 4.98 3.5zM1.5 8.5h3v12h-3v-12zM8.5 8.5h2.9v1.6h.1c.4-.8 1.6-1.6 3.3-1.6 3.5 0 4.2 2.3 4.2 5.3v6.7h-3v-6c0-1.4 0-3.2-2-3.2-2 0-2.3 1.5-2.3 3v6.2h-3v-12z" />
                </svg>
              </a>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Tel: +591 7XX XXXX</p>
              <p>contacto@catefarm.com</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 pb-4">
          © {new Date().getFullYear()} CATEFARM — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
