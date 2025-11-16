// hooks/useGoogleMaps.ts
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: typeof google;
    googleMapsLoaded: boolean;
    googleMapsLoadCallbacks: Array<() => void>;
  }
}

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Inicializar arrays globales si no existen
    if (!window.googleMapsLoadCallbacks) {
      window.googleMapsLoadCallbacks = [];
    }

    // Si ya está cargado, retornar inmediatamente
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Si ya se está cargando, agregar callback a la cola
    if (window.googleMapsLoadCallbacks.length > 0) {
      window.googleMapsLoadCallbacks.push(() => setIsLoaded(true));
      return;
    }

    // Si no está cargado y no se está cargando, cargar por primera vez
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError("Google Maps API Key no configurada");
      return;
    }

    // Marcar que estamos cargando
    window.googleMapsLoadCallbacks.push(() => setIsLoaded(true));

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    script.onload = () => {
      // Ejecutar todos los callbacks en cola
      while (window.googleMapsLoadCallbacks.length) {
        const callback = window.googleMapsLoadCallbacks.shift();
        if (callback) callback();
      }
      window.googleMapsLoaded = true;
    };

    script.onerror = () => {
      setError("Error al cargar Google Maps");
      window.googleMapsLoadCallbacks = [];
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: no removemos el script, pero limpiamos nuestro callback
      const index = window.googleMapsLoadCallbacks.indexOf(() => setIsLoaded(true));
      if (index > -1) {
        window.googleMapsLoadCallbacks.splice(index, 1);
      }
    };
  }, []);

  return { isLoaded, error };
};