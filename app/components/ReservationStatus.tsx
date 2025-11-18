"use client";
import { useState, useEffect } from "react";
import { Calendar, Package, MapPin, Clock, CheckCircle, XCircle, Clock4 } from "lucide-react";
import { Reserva, Producto } from "@/types/reservas";

interface ReservationStatusProps {
  reservations: Reserva[];
  products: Producto[];
}

export function ReservationStatus({ reservations, products }: ReservationStatusProps) {
  const [activeTab, setActiveTab] = useState<'todas' | 'pendientes' | 'completadas' | 'canceladas'>('todas');

  // Filtrar reservas según la pestaña activa
  const filteredReservations = reservations.filter(reserva => {
    switch (activeTab) {
      case 'pendientes':
        return reserva.estado === 'pendiente';
      case 'completadas':
        return reserva.estado === 'completado';
      case 'canceladas':
        return reserva.estado === 'cancelado';
      default:
        return true;
    }
  });

  // Ordenar reservas por fecha (más recientes primero)
  const sortedReservations = [...filteredReservations].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendiente':
        return <Clock4 className="w-5 h-5 text-orange-600" />;
      case 'cancelado':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'pendiente':
        return 'text-orange-800 bg-orange-100 border-orange-200';
      case 'cancelado':
        return 'text-red-800 bg-red-100 border-red-200';
      default:
        return 'text-gray-800 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'completado':
        return 'Completado';
      case 'pendiente':
        return 'Pendiente';
      case 'cancelado':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  const getProductInfo = (productoId: string) => {
    return products.find(p => p.id === productoId) || {
      name: 'Producto no encontrado',
      imagen: '',
      precio: 'BS 0.00'
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (reservations.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-gray-800">Mis Reservas</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No tienes reservas</h3>
          <p className="text-gray-600 mb-4">
            Cuando hagas una reserva, aparecerá aquí con todos los detalles.
          </p>
          <div className="text-sm text-gray-500">
            📍 Podrás ver el estado, fecha de recogida y productos reservados
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-gray-800">Mis Reservas</h2>
        <div className="text-sm text-gray-500">
          Total: {reservations.length} reserva{reservations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'todas'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'pendientes'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes ({reservations.filter(r => r.estado === 'pendiente').length})
          </button>
          <button
            onClick={() => setActiveTab('completadas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'completadas'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completadas ({reservations.filter(r => r.estado === 'completado').length})
          </button>
          <button
            onClick={() => setActiveTab('canceladas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'canceladas'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Canceladas ({reservations.filter(r => r.estado === 'cancelado').length})
          </button>
        </div>
      </div>

      {/* Lista de Reservas */}
      <div className="space-y-4">
        {sortedReservations.map((reserva) => {
          const product = getProductInfo(reserva.productoId);
          
          return (
            <div key={reserva.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header de la reserva */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(reserva.estado)}
                    <div>
                      <h3 className="font-medium text-gray-800">
                        Reserva #{reserva.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Creada el {formatDate(reserva.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reserva.estado)}`}>
                    {getStatusText(reserva.estado)}
                  </div>
                </div>
              </div>

              {/* Detalles de la reserva */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Imagen del producto */}
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={product.imagen}
                      alt={product.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMyOC42ODYzIDE2IDI2IDE4LjY4NjMgMjYgMjJWMjZIMzhWMjJDMzggMTguNjg2MyAzNS4zMTM3IDE2IDMyIDE2WiIgZmlsbD0iIzlDQTNBQiIvPgo8cGF0aCBkPSJNMzggMjhIMjZDMjMuNzkwOSAyOCAyMiAyOS43OTA5IDIyIDMyVjQ0QzIyIDQ2LjIwOTEgMjMuNzkwOSA0OCAyNiA0OEgzOEM0MC4yMDkxIDQ4IDQyIDQ2LjIwOTEgNDIgNDRWMzJDNDIgMjkuNzkwOSA0MC4yMDkxIDI4IDM4IDI4WiIgZmlsbD0iIzlDQTNBQiIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 mb-1">
                      {product.name}
                    </h4>
                    
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Recoger: {formatDate(reserva.fecha)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>Cantidad: {reserva.cantidad}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>Total: Bs {(parseFloat(product.precio.replace('BS ', '')) * parseInt(reserva.cantidad)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                {reserva.sucursalNombre && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Sucursal: {reserva.sucursalNombre}</span>
                    </div>
                  </div>
                )}
              </div>

              
            </div>
          );
        })}
      </div>

      {sortedReservations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No hay reservas {activeTab !== 'todas' ? `en ${activeTab}` : ''}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'pendientes' 
              ? 'Todas tus reservas han sido procesadas o canceladas.'
              : 'Cuando tengas reservas en este estado, aparecerán aquí.'
            }
          </p>
        </div>
      )}
    </section>
  );
}