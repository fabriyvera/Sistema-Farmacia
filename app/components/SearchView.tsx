"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Search, X, Clock } from "lucide-react";
import type { Product } from "../cliente/page";

interface SearchViewProps {
  onSelectProduct: (product: Product) => void;
}

const SearchView = ({ onSelectProduct }: SearchViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Paracetamol",
    "Vitamina C",
    "Ibuprofeno"
  ]);

  const allProducts: Product[] = [
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
      description: "Antiinflamatorio no esteroideo",
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
      description: "Suplemento vitamínico",
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
      description: "Inhibidor de bomba de protones",
      activeIngredient: "Omeprazol 20mg"
    },
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
      id: 6,
      name: "Metformina 850mg",
      category: "Antidiabéticos",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      stock: 380,
      requiresPrescription: true,
      description: "Antidiabético oral",
      activeIngredient: "Metformina 850mg"
    },
    {
      id: 7,
      name: "Aspirina 100mg",
      category: "Analgésicos",
      price: 18.00,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400",
      stock: 350,
      requiresPrescription: false,
      description: "Analgésico y antiagregante",
      activeIngredient: "Ácido acetilsalicílico 100mg"
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
      id: 10,
      name: "Amoxicilina 500mg",
      category: "Antibióticos",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1603349206295-dde20617cb6a?w=400",
      stock: 180,
      requiresPrescription: true,
      description: "Antibiótico de amplio espectro",
      activeIngredient: "Amoxicilina 500mg"
    }
  ];

  const filteredProducts = searchQuery
    ? allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase())
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
    </div>
  );
};

export default SearchView;
