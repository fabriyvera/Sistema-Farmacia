"use client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft, BookmarkCheck, MapPin, Clock, X, CheckCircle2, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { Reserva, Producto, Product, Reservation } from "@/types/reservas";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface MyReservationsProps {
  onClose: () => void;
  onCancel: (reservationId: string) => void;
}

const MyReservations = ({ onClose, onCancel }: MyReservationsProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Convertir Reserva API a Reservation para el cliente
  const convertReservaToReservation = (reserva: Reserva, producto: Producto): Reservation => {
    const reservationDate = new Date(reserva.createdAt);
    const expiryDate = new Date(reservationDate.getTime() + 24 * 60 * 60 * 1000); // 24 horas después

    return {
      id: reserva.id,
      product: {
        id: producto.id,
        name: producto.name,
        category: producto.categoria,
        price: parseFloat(producto.precio),
        image: producto.imagen,
        stock: parseInt(producto.stock),
        requiresPrescription: producto.recetaRequerida === "Si",
        description: producto.descripcion,
        activeIngredient: producto.descripcion.split('.')[0]
      },
      quantity: parseInt(reserva.cantidad),
      pickupLocation: reserva.sucursalNombre || "Sucursal no especificada",
      reservationDate: reserva.createdAt,
      expiryDate: expiryDate.toISOString(),
      status: reserva.estado === 'pendiente' ? 'active' : 
              reserva.estado === 'completada' ? 'collected' : 'expired'
    };
  };

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const [reservasData, productosData] = await Promise.all([
          apiService.getReservas(),
          apiService.getProductos()
        ]);

        // Filtrar reservas del cliente actual (en un sistema real, filtrar por clienteId)
        const clienteReservas = reservasData; // Por ahora mostramos todas
        
        // Convertir reservas al formato del cliente
        const clienteReservations = clienteReservas.map(reserva => {
          const producto = productosData.find(p => p.id === reserva.productoId);
          if (!producto) {
            console.warn(`Producto no encontrado para reserva ${reserva.id}`);
            return null;
          }
          return convertReservaToReservation(reserva, producto);
        }).filter(Boolean) as Reservation[];

        setReservations(clienteReservations);
      } catch (error) {
        console.error("Error loading reservations", error);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleCancel = async (reservationId: string) => {
    try {
      await apiService.updateReserva(reservationId, {
        estado: 'cancelada'
      });
      onCancel(reservationId);
      // Recargar reservas
      const reservasData = await apiService.getReservas();
      const productosData = await apiService.getProductos();
      const updatedReservations = reservasData.map(reserva => {
        const producto = productosData.find(p => p.id === reserva.productoId);
        return producto ? convertReservaToReservation(reserva, producto) : null;
      }).filter(Boolean) as Reservation[];
      setReservations(updatedReservations);
    } catch (error) {
      console.error("Error canceling reservation", error);
      alert("Error al cancelar la reserva");
    }
  };

  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return "Expirada";
    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
  };

  const getStatusBadge = (status: Reservation["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activa</Badge>;
      case "expired":
        return <Badge variant="secondary">Expirada</Badge>;
      case "collected":
        return <Badge variant="outline">Recogida</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filtrar reservas
  const activeReservations = reservations.filter(r => r.status === "active");
  const pastReservations = reservations.filter(r => r.status !== "active");

  if (loading) {
    return (
      <div className="min-h-full bg-white flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg">Mis Reservas</h2>
          </div>
          <Badge variant="secondary">
            Cargando...
          </Badge>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p>Cargando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg">Mis Reservas</h2>
        </div>
        <Badge variant="secondary">
          {activeReservations.length} {activeReservations.length === 1 ? "activa" : "activas"}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <BookmarkCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="mb-2">No tienes reservas</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Cuando reserves productos, aparecerán aquí
            </p>
            <Button onClick={onClose}>
              Explorar Productos
            </Button>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Active Reservations */}
            {activeReservations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h3>Reservas Activas</h3>
                </div>
                <div className="space-y-3">
                  {activeReservations.map((reservation) => (
                    <Card key={reservation.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex gap-3 mb-3">
                          <img
                            src={reservation.product.image}
                            alt={reservation.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex-1">
                                <p className="text-sm mb-1">{reservation.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Cantidad: {reservation.quantity}
                                </p>
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <p className="text-sm text-primary">
                              Total: ${(reservation.product.price * reservation.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{reservation.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Expira: {formatDate(reservation.expiryDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getTimeRemaining(reservation.expiryDate)}
                            </Badge>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-blue-900">
                            <strong>Código de reserva:</strong> {reservation.id}
                          </p>
                          <p className="text-xs text-blue-800 mt-1">
                            Presenta este código al recoger tu producto
                          </p>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full gap-2" size="sm">
                              <X className="h-4 w-4" />
                              Cancelar Reserva
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Cancelar reserva?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El producto volverá a estar disponible para otros clientes.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>No cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleCancel(reservation.id)}>
                                Sí, cancelar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Reservations */}
            {pastReservations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-muted-foreground">Historial</h3>
                </div>
                <div className="space-y-3">
                  {pastReservations.map((reservation) => (
                    <Card key={reservation.id} className="opacity-60">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={reservation.product.image}
                            alt={reservation.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm mb-1">{reservation.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatDate(reservation.reservationDate)}
                                </p>
                              </div>
                              {getStatusBadge(reservation.status)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {reservation.pickupLocation}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Footer */}
      {activeReservations.length > 0 && (
        <div className="sticky bottom-0 bg-orange-50 border-t border-orange-200 p-4">
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-900 mb-1">
                Recuerda recoger tus productos
              </p>
              <p className="text-orange-700 text-xs">
                Las reservas expiran automáticamente después de 24 horas
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;