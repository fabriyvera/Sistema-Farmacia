"use client";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { Product } from "../cliente/page";

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
    </div>
  );
};

export default CategoriesView;
