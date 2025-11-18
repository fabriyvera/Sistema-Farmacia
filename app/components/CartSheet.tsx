"use client";
import { X, Plus, Minus, Calendar, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CartItem, Sucursal, Reserva } from "@/types/reservas";
import { useState } from "react";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  selectedSucursal: Sucursal | null;
  onReservationSuccess?: () => void;
}

export function CartSheet({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  selectedSucursal,
  onReservationSuccess 
}: CartSheetProps) {
  const [isReserving, setIsReserving] = useState(false);
  const [reservationStatus, setReservationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [reservationData, setReservationData] = useState<Reserva[]>([]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calcular fecha de recogida (2 días hábiles después)
  const calculatePickupDate = () => {
    const date = new Date();
    let daysAdded = 0;
    
    while (daysAdded < 2) {
      date.setDate(date.getDate() + 1);
      // Saltar fines de semana (sábado: 6, domingo: 0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  const handleReserve = async () => {
    if (items.length === 0) return;

    setIsReserving(true);
    setReservationStatus('idle');

    try {
      const pickupDate = calculatePickupDate();
      const createdAt = new Date().toISOString().split('T')[0];

      // Crear una reserva por cada producto en el carrito
      const reservationPromises = items.map(item => 
        fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Reservas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            createdAt,
            productoId: item.id,
            fecha: pickupDate,
            cantidad: item.quantity.toString(),
            estado: 'pendiente',
            productoNombre: item.name,
            sucursalId: selectedSucursal?.id,
            sucursalNombre: selectedSucursal?.nombre
          })
        })
      );

      const responses = await Promise.all(reservationPromises);
      const reservationResults = await Promise.all(responses.map(res => res.json()));
      
      setReservationData(reservationResults);
      setReservationStatus('success');
      
      // Llamar al callback de éxito si existe
      if (onReservationSuccess) {
        onReservationSuccess();
      }

      // Cerrar el carrito después de 3 segundos
      setTimeout(() => {
        onClose();
        setReservationStatus('idle');
        setReservationData([]);
      }, 3000);

    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      setReservationStatus('error');
    } finally {
      setIsReserving(false);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'text-green-600 bg-green-100';
      case 'pendiente': return 'text-orange-600 bg-orange-100';
      case 'cancelado': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'completado': return 'Completado';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl">
              {reservationStatus === 'success' ? 'Reserva Exitosa' : 'Carrito de compras'}
            </SheetTitle>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-sm text-orange-600 mt-2">
            📍 Retirar en: {selectedSucursal ? selectedSucursal.nombre : "Seleccionar sucursal"}
          </div>
        </SheetHeader>

        {/* Contenido según estado */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {reservationStatus === 'success' ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">¡Reserva realizada con éxito!</h3>
                <p className="text-gray-600 mb-4">
                  Tu reserva ha sido procesada correctamente. Puedes recoger tus productos en la sucursal seleccionada.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fecha de recogida:</span>
                    <span className="font-medium">
                      {reservationData[0]?.fecha ? new Date(reservationData[0].fecha).toLocaleDateString('es-ES') : 'Próximamente'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sucursal:</span>
                    <span className="font-medium text-right">
                      {selectedSucursal?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('pendiente')}`}>
                      Pendiente
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">Productos reservados:</h4>
                <div className="space-y-3">
                  {reservationData.map((reserva, index) => {
                    const item = items.find(i => i.id === reserva.productoId);
                    return (
                      <div key={reserva.id || index} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                        <div className="w-12 h-12 bg-gray-50 rounded flex items-center justify-center">
                          {item && (
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-contain"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item?.name || 'Producto'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Cantidad: {reserva.cantidad}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.estado)}`}>
                          {getStatusText(reserva.estado)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : reservationStatus === 'error' ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Error en la reserva</h3>
              <p className="text-gray-600 mb-4">
                Ha ocurrido un error al procesar tu reserva. Por favor, intenta nuevamente.
              </p>
              <button
                onClick={() => setReservationStatus('idle')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Información de recogida */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Recogida programada</p>
                    <p className="text-xs text-orange-600">
                      Fecha estimada: {calculatePickupDate().split('-').reverse().join('/')}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      📍 {selectedSucursal?.nombre} - {selectedSucursal?.direccion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items del carrito */}
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:bg-red-50 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                    <div className="mb-2">
                      <span className="text-orange-600">Bs {item.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-3 border border-orange-300 rounded-lg w-fit">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-orange-50 transition-colors rounded-l-lg"
                      >
                        <Minus className="w-4 h-4 text-orange-600" />
                      </button>
                      <span className="px-3 text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-orange-50 transition-colors rounded-r-lg"
                      >
                        <Plus className="w-4 h-4 text-orange-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Solo mostrar cuando hay items y no es estado de éxito/error */}
        {items.length > 0 && reservationStatus === 'idle' && (
          <div className="border-t bg-white px-6 py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total productos:</span>
                <span>{items.reduce((sum, item) => sum + item.quantity, 0)} unidades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800 font-medium">Total a reservar:</span>
                <span className="text-2xl text-orange-600 font-semibold">Bs {subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleReserve}
              disabled={isReserving}
              className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isReserving 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isReserving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Procesando reserva...
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  Reservar ahora
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Al reservar, aceptas recoger los productos en la sucursal seleccionada dentro de las 48 horas hábiles.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}