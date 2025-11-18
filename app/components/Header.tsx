"use client";
import { Search, ShoppingCart, MapPin, LogOut } from "lucide-react";
import { Sucursal } from "@/types/reservas";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
  selectedSucursal: Sucursal | null;
  sucursales: Sucursal[];
  onSucursalChange: (sucursal: Sucursal) => void;
  onSearch: (term: string) => void;
  isAuthenticated: boolean;
  userData: any;
  onLogout: () => void;
}

export function Header({ 
  onCartClick, 
  cartItemsCount, 
  selectedSucursal,
  sucursales,
  onSucursalChange,
  onSearch,
  isAuthenticated,
  userData,
  onLogout
}: HeaderProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  // Efecto para búsqueda en tiempo real con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchInput);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const getUserDisplayName = () => {
    if (!userData) return "Usuario";
    
    if (userData.userType === 'admin') {
      return userData.nombres || userData.username;
    } else {
      return userData.nombreCompleto || userData.username;
    }
  };

  const operationalSucursales = sucursales.filter(s => s.estado === "Operativa");

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <h1 className="text-white text-2xl">CATEFARM</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar medicamentos, vitaminas, productos de cuidado personal..."
                className="w-full pl-12 pr-4 py-3 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:shadow-lg transition-all border-2 border-white"
                value={searchInput}
                onChange={handleSearchChange}
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {/* User Account - Mostrar según estado de autenticación */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:block text-orange-100 text-sm">
                  Hola, {getUserDisplayName()}
                </span>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 bg-orange-400 hover:bg-orange-300 px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block">Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="hidden md:flex bg-orange-400 hover:bg-orange-300 px-6 py-2 rounded-lg transition-colors"
              >
                Iniciar sesión
              </button>
            )}

            {/* Cart - Solo mostrar para clientes */}
            {isAuthenticated && userData?.userType === 'client' && (
              <button 
                onClick={onCartClick}
                className="relative hover:opacity-80 transition-opacity flex flex-col items-center"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
                <span className="hidden md:block text-sm mt-1">Carrito</span>
              </button>
            )}
          </div>
        </div>

        {/* Location Bar - Solo mostrar para clientes */}
        {isAuthenticated && userData?.userType === 'client' && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="opacity-90">Recoger en:</span>
            <div className="relative group">
              <button className="hover:underline flex items-center gap-1">
                {selectedSucursal ? selectedSucursal.nombre : "Seleccionar sucursal"} ▼
              </button>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white text-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {operationalSucursales.map(sucursal => (
                  <button
                    key={sucursal.id}
                    onClick={() => onSucursalChange(sucursal)}
                    className={`w-full text-left px-4 py-2 hover:bg-orange-50 first:rounded-t-lg last:rounded-b-lg ${
                      selectedSucursal?.id === sucursal.id ? 'bg-orange-100 text-orange-600' : ''
                    }`}
                  >
                    <div className="font-medium">{sucursal.nombre}</div>
                    <div className="text-xs text-gray-600">{sucursal.direccion}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}