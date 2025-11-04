"use client";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Percent, TrendingUp, Clock } from "lucide-react";
import type { Product } from "../cliente/page";

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
}

const HomeView = ({ onSelectProduct }: HomeViewProps) => {
  const featuredProducts: Product[] = [
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
      category: "Antiinflamatorios",
      price: 35.00,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400",
      stock: 320,
      requiresPrescription: false,
      description: "Antiinflamatorio no esteroideo para dolor e inflamación",
      activeIngredient: "Ibuprofeno 400mg"
    },
    {
      id: 3,
      name: "Vitamina C 1000mg",
      category: "Vitaminas",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1550572017-4240c1baaf90?w=400",
      stock: 500,
      requiresPrescription: false,
      description: "Suplemento vitamínico para fortalecer el sistema inmune",
      activeIngredient: "Ácido ascórbico 1000mg"
    },
    {
      id: 4,
      name: "Omeprazol 20mg",
      category: "Antiulcerosos",
      price: 55.00,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      stock: 280,
      requiresPrescription: true,
      description: "Inhibidor de bomba de protones para úlceras y reflujo",
      activeIngredient: "Omeprazol 20mg"
    }
  ];

  const discountProducts: Product[] = [
    {
      id: 5,
      name: "Loratadina 10mg",
      category: "Antihistamínicos",
      price: 28.00,
      image: "https://images.unsplash.com/photo-1603349206295-dde20617cb6a?w=400",
      stock: 200,
      requiresPrescription: false,
      description: "Antihistamínico para alergias estacionales",
      activeIngredient: "Loratadina 10mg"
    },
    {
      id: 6,
      name: "Metformina 850mg",
      category: "Antidiabéticos",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      stock: 380,
      requiresPrescription: true,
      description: "Antidiabético oral para control de glucosa",
      activeIngredient: "Metformina 850mg"
    }
  ];

  const categories = [
    { name: "Analgésicos", icon: "💊", color: "bg-red-100 text-red-700" },
    { name: "Vitaminas", icon: "🌿", color: "bg-green-100 text-green-700" },
    { name: "Antibióticos", icon: "🔬", color: "bg-blue-100 text-blue-700" },
    { name: "Digestivos", icon: "🫀", color: "bg-purple-100 text-purple-700" }
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-orange-600 text-white border-none">
        <CardContent className="p-6">
          <h2 className="text-xl mb-2">¡Bienvenido a CATEFARM!</h2>
          <p className="text-sm text-white/90">
            Tu farmacia de confianza, ahora en tu móvil
          </p>
        </CardContent>
      </Card>

      {/* Quick Categories */}
      <div>
        <h3 className="mb-3">Categorías Populares</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`${cat.color} rounded-xl p-3 text-center transition-transform active:scale-95`}
            >
              <div className="text-2xl mb-1">{cat.icon}</div>
              <div className="text-xs">{cat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-5 w-5 text-primary" />
          <h3>Productos Destacados</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => onSelectProduct(product)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                {product.requiresPrescription && (
                  <Badge className="absolute top-2 right-2 bg-red-500 text-xs">
                    Receta
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm mb-1 line-clamp-2">{product.name}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {product.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary">${product.price.toFixed(2)}</span>
                  <Badge variant="outline" className="text-xs">
                    Stock: {product.stock}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Discount Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Percent className="h-5 w-5 text-primary" />
          <h3>Ofertas Especiales</h3>
        </div>
        <div className="space-y-3">
          {discountProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onSelectProduct(product)}
            >
              <CardContent className="p-3 flex gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm mb-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary">${product.price.toFixed(2)}</span>
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
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm mb-1">Reserva</p>
            <p className="text-xs text-muted-foreground">Válida 24 horas</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm mb-1">Retiro</p>
            <p className="text-xs text-muted-foreground">Sin costo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomeView;
