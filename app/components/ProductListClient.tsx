"use client";
import { ProductCard } from "./ProductCard";
import { Producto } from "@/types/reservas";

interface ProductListClientProps {
  products: Producto[];
  selectedCategory: string | null;
  searchTerm: string;
  onAddToCart: (id: string) => void;
  onProductClick: (id: string) => void;
  showAll: boolean;
  onShowMore: () => void;
}

export function ProductListClient({ 
  products, 
  selectedCategory, 
  searchTerm,
  onAddToCart, 
  onProductClick,
  showAll,
  onShowMore 
}: ProductListClientProps) {
  // Limitar productos si no se muestra todo
  const displayedProducts = showAll 
    ? products 
    : products.slice(0, 8);

  const hasMoreProducts = products.length > 8 && !showAll;

  // Determinar el título según los filtros aplicados
  const getSectionTitle = () => {
    if (searchTerm) {
      return `Resultados de búsqueda: "${searchTerm}"`;
    }
    if (selectedCategory) {
      return `Productos de ${selectedCategory}`;
    }
    return 'Productos Destacados';
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-gray-800">
          {getSectionTitle()}
          <span className="text-sm text-gray-500 ml-2">
            ({products.length} producto{products.length !== 1 ? 's' : ''})
          </span>
        </h2>
        
        {hasMoreProducts && (
          <button 
            onClick={onShowMore}
            className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
          >
            Ver más &gt;
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? `No se encontraron productos para "${searchTerm}"`
              : "No hay productos en esta categoría"
            }
          </p>
          <p className="text-gray-400 mt-2">
            {searchTerm 
              ? "Intenta con otros términos de búsqueda"
              : "Prueba con otra categoría o vuelve más tarde"
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.precio}
                image={product.imagen}
                stock={product.stock}
                onAddToCart={onAddToCart}
                onClick={onProductClick}
              />
            ))}
          </div>

          {showAll && products.length > 8 && (
            <div className="text-center mt-8">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-orange-600 hover:text-orange-700 transition-colors font-medium"
              >
                ↑ Volver arriba
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}