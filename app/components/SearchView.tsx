"use client";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, X, Clock } from "lucide-react";
import { apiService } from "@/lib/api";
import { Producto, Product } from "@/types/reservas";
import Image from "next/image";

interface SearchViewProps {
  onSelectProduct: (product: Product) => void;
}

const SearchView = ({ onSelectProduct }: SearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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
    activeIngredient: producto.descripcion.split('.')[0]
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productos = await apiService.getProductos();
        const products = productos.map(convertProductoToProduct);
        setAllProducts(products);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = searchQuery
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };
   if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-32">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar medicamentos..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {!searchQuery && recentSearches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm">Búsquedas Recientes</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <div
                key={index}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {term}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div>
          <h3 className="mb-3 text-sm text-muted-foreground">
            {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
          </h3>

          {filteredProducts.length > 0 ? (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
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
                            {product.category}
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
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No se encontraron productos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Intenta con otro término de búsqueda
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!searchQuery && (
        <div>
          <h3 className="mb-3 text-sm">Búsquedas Populares</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Dolor de cabeza", "Vitaminas", "Gripe", "Alergia"].map((term) => (
              <Card
                key={term}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSearchQuery(term)}
              >
                <CardContent className="p-4 text-center">
                  <p className="text-sm">{term}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
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
};

export default SearchView;
