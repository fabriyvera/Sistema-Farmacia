"use client";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { Product } from "../cliente/page";
import Image from "next/image";

interface CategoriesViewProps {
  onSelectProduct: (product: Product) => void;
}

const CategoriesView = ({ onSelectProduct }: CategoriesViewProps) => {
  const [activeCategory, setActiveCategory] = useState("analgesicos");

  const allProducts: Record<string, Product[]> = {
    analgesicos: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        category: "Analgésicos",
        price: 25.50,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        stock: 450,
        requiresPrescription: false,
        description: "Analgésico y antipirético para alivio del dolor y fiebre",
        activeIngredient: "Paracetamol 500mg"
      },
      {
        id: 2,
        name: "Ibuprofeno 400mg",
        category: "Analgésicos",
        price: 35.00,
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
        stock: 320,
        requiresPrescription: false,
        description: "Antiinflamatorio no esteroideo",
        activeIngredient: "Ibuprofeno 400mg"
      },
      {
        id: 7,
        name: "Aspirina 100mg",
        category: "Analgésicos",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
        stock: 350,
        requiresPrescription: false,
        description: "Analgésico y antiagregante plaquetario",
        activeIngredient: "Ácido acetilsalicílico 100mg"
      }
    ],
    vitaminas: [
      {
        id: 3,
        name: "Vitamina C 1000mg",
        category: "Vitaminas",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1550572017-4240c1baaf90?w=400",
        stock: 500,
        requiresPrescription: false,
        description: "Suplemento vitamínico",
        activeIngredient: "Ácido ascórbico 1000mg"
      },
      {
        id: 8,
        name: "Vitamina D3 2000 UI",
        category: "Vitaminas",
        price: 52.00,
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
        stock: 280,
        requiresPrescription: false,
        description: "Suplemento de vitamina D",
        activeIngredient: "Colecalciferol 2000 UI"
      },
      {
        id: 9,
        name: "Complejo B",
        category: "Vitaminas",
        price: 38.00,
        image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400",
        stock: 410,
        requiresPrescription: false,
        description: "Complejo vitamínico del grupo B",
        activeIngredient: "Vitaminas B1, B6, B12"
      }
    ],
    antibioticos: [
      {
        id: 10,
        name: "Amoxicilina 500mg",
        category: "Antibióticos",
        price: 85.00,
        image: "https://images.unsplash.com/photo-1603349206295-dde20617cb6a?w=400",
        stock: 180,
        requiresPrescription: true,
        description: "Antibiótico de amplio espectro",
        activeIngredient: "Amoxicilina 500mg"
      },
      {
        id: 11,
        name: "Azitromicina 500mg",
        category: "Antibióticos",
        price: 125.00,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
        stock: 95,
        requiresPrescription: true,
        description: "Antibiótico macrólido",
        activeIngredient: "Azitromicina 500mg"
      }
    ],
    digestivos: [
      {
        id: 4,
        name: "Omeprazol 20mg",
        category: "Digestivos",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
        stock: 280,
        requiresPrescription: true,
        description: "Inhibidor de bomba de protones",
        activeIngredient: "Omeprazol 20mg"
      },
      {
        id: 12,
        name: "Ranitidina 150mg",
        category: "Digestivos",
        price: 42.00,
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
        stock: 220,
        requiresPrescription: false,
        description: "Antiácido para gastritis",
        activeIngredient: "Ranitidina 150mg"
      }
    ],
    alergias: [
      {
        id: 5,
        name: "Loratadina 10mg",
        category: "Antihistamínicos",
        price: 28.00,
        image: "https://images.unsplash.com/photo-1603349206295-dde20617cb6a?w=400",
        stock: 200,
        requiresPrescription: false,
        description: "Antihistamínico para alergias",
        activeIngredient: "Loratadina 10mg"
      },
      {
        id: 13,
        name: "Cetirizina 10mg",
        category: "Antihistamínicos",
        price: 32.00,
        image: "https://images.unsplash.com/photo-1550572017-4240c1baaf90?w=400",
        stock: 315,
        requiresPrescription: false,
        description: "Antihistamínico de segunda generación",
        activeIngredient: "Cetirizina 10mg"
      }
    ]
  };

  const categories = [
    { id: "analgesicos", name: "Analgésicos", icon: "💊", count: allProducts.analgesicos.length },
    { id: "vitaminas", name: "Vitaminas", icon: "🌿", count: allProducts.vitaminas.length },
    { id: "antibioticos", name: "Antibióticos", icon: "🔬", count: allProducts.antibioticos.length },
    { id: "digestivos", name: "Digestivos", icon: "🫀", count: allProducts.digestivos.length },
    { id: "alergias", name: "Alergias", icon: "🤧", count: allProducts.alergias.length }
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4">Explorar por Categorías</h2>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full grid grid-cols-3 mb-4 h-auto">
          {categories.slice(0, 3).map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs py-2">
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsList className="w-full grid grid-cols-2 mb-6 h-auto">
          {categories.slice(3).map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs py-2">
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(allProducts).map(([categoryKey, products]) => (
          <TabsContent key={categoryKey} value={categoryKey} className="space-y-3 mt-0">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-orange-800">
                {products.length} productos disponibles en esta categoría
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
                  onClick={() => onSelectProduct(product)}
                >
                  <CardContent className="p-0 flex">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-l-lg"
                    />
                    <div className="flex-1 p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm mb-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.activeIngredient}
                          </p>
                        </div>
                        {product.requiresPrescription && (
                          <Badge variant="destructive" className="text-xs ml-2">
                            Receta
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-primary">${product.price.toFixed(2)}</span>
                        <Badge variant="outline" className="text-xs">
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 text-right">
            
                    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
                      {/* Columna 1: Logo alineado */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="relative w-36 h-36 mb-3">
                          <Image src="/logo-catefarm.jpg" alt="Logo CATEFARM" fill style={{ objectFit: "contain" }} />
                        </div>
                        
                        <div className="text-sm text-gray-500 justify-center">    Sistema de gestión</div>
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
};

export default CategoriesView;
