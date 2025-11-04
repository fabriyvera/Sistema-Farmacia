"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
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
      <div className="text-center text-xs text-muted-foreground py-4">
        <p>CATEFARM Mobile</p>
        <p className="mt-1">Versión 1.0.0</p>
      </div>
    </div>
  );
};

export default SettingsView;
