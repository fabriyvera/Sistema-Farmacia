"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  onAddToCart: (id: string) => void;
  onClick: (id: string) => void;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  stock,
  onAddToCart,
  onClick 
}: ProductCardProps) {
  const getStockColor = (stock: number) => {
    if (stock > 50) return "text-green-600";
    if (stock > 10) return "text-orange-600";
    return "text-red-600";
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el click se propague al contenedor principal
    onAddToCart(id);
  };

  return (
    <div 
      onClick={() => onClick(id)}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden group">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-200"
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            // Aquí podrías agregar funcionalidad de favoritos
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm hover:bg-red-50 transition-colors"
        >
          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
        </button>
        
        {/* Stock Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-white ${getStockColor(stock)}`}>
          {stock} disponibles
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Price */}
          <div className="mb-2">
            <div className="text-orange-600 text-xl">
              Bs {price.toFixed(2)}
            </div>
          </div>

          {/* Product Name */}
          <div className="text-gray-700 text-sm mb-3 line-clamp-2">
            {name}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCartClick}
          disabled={stock === 0}
          className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          <span>{stock === 0 ? 'Sin stock' : 'Agregar'}</span>
          {stock > 0 && <ShoppingCart className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}