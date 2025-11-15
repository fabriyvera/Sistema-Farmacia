"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import Image from "next/image";
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Shield
} from "lucide-react";

interface SettingsItem {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value?: string | boolean;
  badge?: string;
  toggle?: boolean;
}

const SettingsView = () => {
  const user = {
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+52 555 1234 5678"
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Cuenta",
      items: [
        { icon: User, label: "Información Personal", value: user.name },
        { icon: Mail, label: "Correo Electrónico", value: user.email },
        { icon: Phone, label: "Teléfono", value: user.phone },
      ]
    },
    {
      title: "Mis Datos",
      items: [
        { icon: MapPin, label: "Sucursales Favoritas", badge: "2" },
        { icon: FileText, label: "Mis Reservas", badge: "3" },
        { icon: FileText, label: "Historial de Retiros", badge: "8" },
      ]
    },
    {
      title: "Preferencias",
      items: [
        { icon: Bell, label: "Notificaciones", toggle: true, value: true },
        { icon: Shield, label: "Privacidad", toggle: false },
      ]
    },
    {
      title: "Ayuda",
      items: [
        { icon: HelpCircle, label: "Centro de Ayuda" },
        { icon: FileText, label: "Términos y Condiciones" },
        { icon: FileText, label: "Política de Privacidad" },
      ]
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="mb-1">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Card */}
      <Card className="bg-gradient-to-r from-primary to-orange-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-white/90 mb-1">Puntos de Lealtad</p>
              <p className="text-3xl">1,250</p>
            </div>
            <div className="bg-white/20 rounded-full p-3">
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-white/90">
            ¡Estás a 250 puntos de tu próxima recompensa!
          </p>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3 className="mb-3 text-sm text-muted-foreground">{section.title}</h3>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <div key={itemIndex}>
                    <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1 text-left">
                        <p className="text-sm">{item.label}</p>
                        {'value' in item && typeof item.value === "string" && item.value && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.value}
                          </p>
                        )}
                      </div>
                      {item.badge && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.toggle !== undefined ? (
                        <Switch defaultChecked={'value' in item ? !!item.value : false} />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {itemIndex < section.items.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}

      {/* Logout Button */}
      <Card className="border-red-200">
        <CardContent className="p-0">
          <button className="w-full p-4 flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </CardContent>
      </Card>

      {/* App Info */}
 
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

export default SettingsView;
