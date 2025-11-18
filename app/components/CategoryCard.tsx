"use client";
import Image from "next/image";
import { useState } from "react";

interface CategoryCardProps {
  name: string;
  icon: string;
  itemCount: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryCard({ 
  name, 
  icon, 
  itemCount, 
  isActive = false,
  onClick 
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const isImagePath = icon.startsWith("/");

  return (
    <button 
      onClick={onClick}
      className={`group flex flex-col items-center p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${
        isActive 
          ? 'border-orange-500 bg-orange-50' 
          : 'border-gray-100 hover:border-orange-300 bg-white'
      }`}
    >
      <div className="w-16 h-16 mb-3 group-hover:scale-110 transition-transform flex items-center justify-center">
        {isImagePath && !imageError ? (
          <Image 
            src={icon} 
            alt={name}
            width={64}
            height={64}
            className="object-contain"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className={`text-4xl ${isActive ? 'text-orange-600' : 'text-gray-600'}`}>
            {isImagePath ? "📦" : icon}
          </div>
        )}
      </div>
      <h3 className={`text-center mb-1 font-medium ${
        isActive ? 'text-orange-600' : 'text-gray-800'
      }`}>
        {name}
      </h3>
      <p className={`text-sm ${
        isActive ? 'text-orange-500' : 'text-gray-500'
      }`}>
        {itemCount} productos
      </p>
    </button>
  );
}