"use client";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Percent, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Producto, Product } from "@/types/reservas";

interface HomeViewProps {
  onSelectProduct: (product: Product) => void;
}

const HomeView = ({ onSelectProduct }: HomeViewProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Convertir Producto API a Product para el cliente
  const convertProductoToProduct = (producto: Producto): Product => ({
    id: producto.id,
    name: producto.name,
    category: producto.categoria,
    price: parseFloat(producto.precio),
    image: producto.imagen,
    stock: parseInt(producto.stock),
    requiresPrescription: producto.recetaRequerida === "Si",
    description: producto.descripcion,
    activeIngredient: producto.descripcion.split('.')[0] // Usar primera parte de la descripción
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productos = await apiService.getProductos();
        
        // Convertir productos de API a formato de cliente
        const products = productos.map(convertProductoToProduct);
        
        // Productos destacados (primeros 4)
        setFeaturedProducts(products.slice(0, 4));
        
        // Productos en oferta (podrías filtrar por algún criterio)
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
    { name: "Digestivos", icon: "🫀", color: "bg-purple-100 text-purple-700" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando productos...</p>
      </div>
    );
  }

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
        <div className="space-y-3">
          {featuredProducts.map((product) => (
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
                  <div className="flex items-center justify-between">
                    <span className="text-primary">Bs. {product.price.toFixed(2)}</span>
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
                    <span className="text-primary">Bs. {product.price.toFixed(2)}</span>
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