"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

const RegisterEmployee = () => {
  // Estados para los campos del administrador
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nombres, setNombres] = useState("");
  const [apPaterno, setApPaterno] = useState("");
  const [apMaterno, setApMaterno] = useState("");
  const [sucursal, setSucursal] = useState("0");
  const [estado, setEstado] = useState("1"); // 1 = activo por defecto
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const autocompleteInstanceRef = useRef<any>(null);

  const { isLoaded: mapsLoaded, error: mapsError } = useGoogleMaps();

  // Para debuggear
  useEffect(() => {
    console.log('Estado actual del formulario:', {
      username,
      password,
      nombres,
      apPaterno,
      apMaterno,
      email,
      telefono,
      sucursal,
      estado,
      direccion
    });
  }, [username, password, nombres, apPaterno, apMaterno, email, telefono, sucursal, estado, direccion]);

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
        setDireccion(place.formatted_address || '');
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
          setDireccion(results[0].formatted_address);
        } else {
          setDireccion(`Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`);
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDireccion(e.target.value);
  };

  const handleSubmit = async () => {
    // Validar campos obligatorios
    if (!username || !password || !nombres || !apPaterno || !email || !telefono) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    const newAdmin = {
      nm_adm: username,  
      pw_adm: password,
      nms_adm: nombres,
      app_adm: apPaterno,
      apm_adm: apMaterno,
      fk_rl: 0,
      fk_sc: parseInt(sucursal) || 0,
      st_adm: estado === "1" ? 1 : 0,
      em_adm: email,
      tl_adm: telefono,
      ds_adm: direccion, 
    };

    console.log('Enviando datos al backend:', newAdmin);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      if (result.success) {
        // Limpiar formulario
        setUsername("");
        setPassword("");
        setNombres("");
        setApPaterno("");
        setApMaterno("");
        setSucursal("0");
        setEstado("1");
        setEmail("");
        setTelefono("");
        setDireccion("");
        
        // Remover marcador
        if (markerRef.current) {
          markerRef.current.setMap(null);
          markerRef.current = null;
        }
        
        alert("Administrador registrado correctamente");
      } else {
        throw new Error(result.message || "Error desconocido");
      }
    } catch (error) {
      console.error("Error completo al registrar administrador:", error);
      alert(error instanceof Error ? error.message : "Error al registrar administrador");
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
        <h1 className="text-2xl font-bold">Registrar Nuevo Administrador</h1>
        <p className="text-muted-foreground">
          Complete la información del nuevo administrador
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Campos de credenciales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Ej: juan.perez"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingrese la contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Campos de nombres */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  placeholder="Ej: Juan Carlos"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apPaterno">Apellido Paterno *</Label>
                <Input
                  id="apPaterno"
                  placeholder="Ej: Pérez"
                  value={apPaterno}
                  onChange={(e) => setApPaterno(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apMaterno">Apellido Materno</Label>
                <Input
                  id="apMaterno"
                  placeholder="Ej: López"
                  value={apMaterno}
                  onChange={(e) => setApMaterno(e.target.value)}
                />
              </div>
            </div>

            {/* Campos de contacto */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@catefarm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="+591 78218688"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </div>

            {/* Campos de configuración */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sucursal">Sucursal</Label>
                <Input
                  id="sucursal"
                  type="number"
                  placeholder="0"
                  value={sucursal}
                  onChange={(e) => setSucursal(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Número de sucursal asignada
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Mapa de Google Maps para dirección - ESTA PARTE ES CLAVE */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección Seleccionada *</Label>
                <Input
                  ref={autocompleteRef}
                  id="direccion"
                  placeholder="Escribe para buscar dirección o haz clic en el mapa"
                  value={direccion}
                  onChange={handleInputChange}
                />
                <p className="text-sm text-muted-foreground">
                  {direccion ? "Dirección seleccionada correctamente" : "Haz clic en el mapa o busca una dirección"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Selecciona la ubicación en el mapa *</Label>
                
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
                Registrar Administrador
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterEmployee;