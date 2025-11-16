"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const RegisterEmployee = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstanceRef = useRef<any>(null);

  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  // Inicializar mapa cuando Google Maps esté cargado
  useEffect(() => {
    if (mapsLoaded && mapRef.current && !mapInstanceRef.current) {
      initializeMap();
    }
  }, [mapsLoaded]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -16.5000, lng: -68.1500 },
        zoom: 12,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Evento de clic en el mapa
      map.addListener("click", (e: any) => {
        handleMapClick(e.latLng);
      });

      // Inicializar autocomplete
      initializeAutocomplete();

    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const initializeAutocomplete = () => {
    if (!window.google || !autocompleteRef.current) return;

    // Destruir autocomplete anterior si existe
    if (autocompleteInstanceRef.current) {
      window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'bo' },
      fields: ['formatted_address', 'geometry']
    });

    autocompleteInstanceRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        // Mover el mapa
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(17);
        
        // Colocar marcador
        placeMarker({ lat, lng });
        
        // Establecer dirección
        setLocation(place.formatted_address || '');
      }
    });
  };

  const handleMapClick = (latLng: any) => {
    const lat = latLng.lat();
    const lng = latLng.lng();
    
    placeMarker({ lat, lng });
    geocodeLocation({ lat, lng });
  };

  const placeMarker = (location: { lat: number; lng: number }) => {
    if (!window.google || !mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    markerRef.current = new window.google.maps.Marker({
      position: location,
      map: mapInstanceRef.current,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    // Evento para arrastrar marcador
    markerRef.current.addListener('dragend', (e: any) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      geocodeLocation({ lat: newLat, lng: newLng });
    });
  };

  const geocodeLocation = (location: { lat: number; lng: number }) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      { location },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          setLocation(results[0].formatted_address);
        } else {
          setLocation(`Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`);
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSubmit = async () => {
    if (!name || !role || !email || !phone) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    const newEmployee = {
      nombre: name,
      rol: role,
      email: email,
      telefono: phone,
      direccion: location,
      estado: "Activo",
    };

    try {
      const response = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) throw new Error("Error al guardar el empleado");
      
      // Limpiar formulario
      setName("");
      setRole("");
      setEmail("");
      setPhone("");
      setLocation("");
      
      // Remover marcador
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      
      alert("Empleado registrado correctamente");
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      alert("Error al registrar empleado");
    }
  };

  // Limpiar event listeners al desmontar
  useEffect(() => {
    return () => {
      if (autocompleteInstanceRef.current && autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registrar Nuevo Empleado</h1>
        <p className="text-muted-foreground">
          Complete la información del nuevo empleado
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Juan Pérez López"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Puesto *</Label>
                <Input
                  id="role"
                  placeholder="Ej: Gerente de Ventas"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="empleado@catefarm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  placeholder="+591 78218688"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Dirección Seleccionada</Label>
                <Input
                  ref={autocompleteRef}
                  id="location"
                  placeholder="Escribe para buscar dirección o haz clic en el mapa"
                  value={location}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">
                  {location ? "Dirección seleccionada correctamente" : "Haz clic en el mapa o busca una dirección"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Selecciona la ubicación en el mapa</Label>
                
                {mapsError ? (
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center flex-col gap-4">
                    <p className="text-red-500 text-center">{mapsError}</p>
                    <p className="text-sm text-center text-muted-foreground">
                      Verifica tu API Key de Google Maps en las variables de entorno
                    </p>
                  </div>
                ) : !mapsLoaded ? (
                  <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <p>Cargando mapa...</p>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={mapRef} 
                    className="h-64 w-full rounded-md border"
                  />
                )}
                
                <p className="text-sm text-muted-foreground">
                  • Haz clic en cualquier lugar del mapa para seleccionar la ubicación
                  <br/>
                  • Puedes arrastrar el marcador para ajustar la posición
                  <br/>
                  • Escribe en el campo de dirección para buscar ubicaciones específicas
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button onClick={handleSubmit}>
                Registrar Empleado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterEmployee;