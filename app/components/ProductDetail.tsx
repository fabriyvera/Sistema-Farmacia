"use client";
import { Heart, ShoppingCart, ChevronLeft, Calendar, User } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Producto } from "@/types/reservas";

interface ProductDetailProps {
  product: Producto;
  onAddToCart: (id: string) => void;
  onBack: () => void;
}

export function ProductDetail({ product, onAddToCart, onBack }: ProductDetailProps) {
  const price = parseFloat(product.precio.replace('BS ', ''));
  const stock = parseInt(product.stock);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Inicio &gt; {product.categoria} &gt; {product.name}</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative">
              
              
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={product.imagen}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
              <div className="text-gray-500 text-sm mb-2">{product.categoria}</div>
              <h1 className="text-2xl md:text-3xl text-gray-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className={`px-3 py-1 rounded-full ${
                  stock > 50 ? 'bg-green-100 text-green-800' :
                  stock > 10 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {stock} disponibles
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Caduca: {new Date(product.caducidad).toLocaleDateString()}
                </div>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="text-4xl text-orange-600 mb-2">
                  {product.precio}
                </div>
                {product.recetaRequerida === "Si" && (
                  <div className="text-red-600 text-sm font-medium">
                    ⚠️ Requiere receta médica
                  </div>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => onAddToCart(product.id)}
                disabled={stock === 0}
                className={`w-full md:w-auto py-4 px-12 rounded-lg flex items-center justify-center gap-3 transition-colors mb-8 ${
                  stock === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <span className="text-lg">{stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</span>
                {stock > 0 && <ShoppingCart className="w-5 h-5" />}
              </button>

              {/* Additional Info */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Proveedor: {product.proveedor}</span>
                </div>
                
                <div>
                  <h2 className="text-xl text-gray-800 mb-4">Descripción</h2>
                  <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
                </div>

                <div>
                  <h2 className="text-xl text-gray-800 mb-4">Estado del producto</h2>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.estado === "Óptimo" ? 'bg-green-100 text-green-800' :
                    product.estado === "Bajo" ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.estado}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}