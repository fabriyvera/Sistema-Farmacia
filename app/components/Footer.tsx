"use client";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sobre Nosotros */}
          <div>
            <h3 className="text-xl text-orange-400 mb-4">CATEFARM</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu farmacia de confianza desde 1995. Comprometidos con tu salud y bienestar.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg mb-4">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                <div>
                  <div>2-2345678</div>
                  <div>+591 70123456</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                <div>contacto@catefarm.com.bo</div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                <div>Av. 6 de Agosto #123, La Paz - Bolivia</div>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-lg mb-4">Horarios</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-1 text-orange-400 flex-shrink-0" />
                <div>
                  <div className="text-gray-300">Lunes a Viernes</div>
                  <div className="text-white">8:00 AM - 10:00 PM</div>
                </div>
              </div>
              <div className="ml-6">
                <div className="text-gray-300">Sábados</div>
                <div className="text-white">9:00 AM - 9:00 PM</div>
              </div>
              <div className="ml-6">
                <div className="text-gray-300">Domingos</div>
                <div className="text-white">10:00 AM - 6:00 PM</div>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Nuestras Sucursales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 CATEFARM - Catedral Farmacias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
