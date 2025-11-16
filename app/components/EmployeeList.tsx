"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, Edit, Trash2, Mail, Phone, MapPin, User } from "lucide-react";

interface Admin {
  pk_adm: string;
  nm_adm: string;
  nms_adm: string;
  app_adm: string;
  apm_adm: string;
  fk_rl: number;
  fk_sc: number;
  st_adm: boolean;
  em_adm: string;
  tl_adm: string;
  ds_adm: string;
}

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin");
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        if (data.success) {
          setAdmins(data.data);
        } else {
          throw new Error(data.message || "Error al cargar los datos");
        }
      } catch (error) {
        console.error("Error cargando administradores:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Función para obtener las iniciales del nombre
  const getInitials = (nombres: string, apPaterno: string, apMaterno: string) => {
    const firstInitial = nombres ? nombres.charAt(0) : "";
    const lastInitial = apPaterno ? apPaterno.charAt(0) : "";
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Función para formatear el nombre completo
  const getFullName = (nombres: string, apPaterno: string, apMaterno: string) => {
    return `${nombres || ""} ${apPaterno || ""} ${apMaterno || ""}`.trim();
  };

  // Función para obtener el texto del rol
  const getRoleText = (fk_rl: number) => {
    const roles = {
      0: "Administrador",
      1: "Supervisor", 
      2: "Empleado",
      3: "Usuario"
    };
    return roles[fk_rl as keyof typeof roles] || `Rol ${fk_rl}`;
  };

  // Filtrar administradores basado en el término de búsqueda
  const filteredAdmins = admins.filter((admin) => {
    const fullName = getFullName(admin.nms_adm, admin.app_adm, admin.apm_adm).toLowerCase();
    const role = getRoleText(admin.fk_rl).toLowerCase();
    const email = admin.em_adm?.toLowerCase() || "";
    const username = admin.nm_adm?.toLowerCase() || "";
    
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      role.includes(searchLower) ||
      email.includes(searchLower) ||
      username.includes(searchLower)
    );
  });

  // Función para manejar la eliminación (opcional)
  const handleDelete = async (adminId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este administrador?")) {
      try {
        const response = await fetch(`/api/admin/${adminId}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
          // Actualizar la lista removiendo el administrador eliminado
          setAdmins(admins.filter(admin => admin.pk_adm !== adminId));
          alert("Administrador eliminado correctamente");
        } else {
          throw new Error(result.message || "Error al eliminar");
        }
      } catch (error) {
        console.error("Error eliminando administrador:", error);
        alert(error instanceof Error ? error.message : "Error al eliminar administrador");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lista de Administradores</h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todos los administradores del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar administradores por nombre, rol, email o username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredAdmins.length} de {admins.length} administradores
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando administradores...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No se encontraron administradores con ese criterio de búsqueda" : "No hay administradores registrados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdmins.map((admin) => (
                    <TableRow key={admin.pk_adm}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getInitials(admin.nms_adm, admin.app_adm, admin.apm_adm)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {getFullName(admin.nms_adm, admin.app_adm, admin.apm_adm)}
                            </div>
                            {admin.em_adm && (
                              <div className="text-sm text-muted-foreground">
                                {admin.em_adm}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {admin.nm_adm}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {getRoleText(admin.fk_rl)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">Suc. {admin.fk_sc}</span>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          {admin.em_adm && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-[150px]">
                                {admin.em_adm}
                              </span>
                            </div>
                          )}
                          {admin.tl_adm && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {admin.tl_adm}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {admin.ds_adm ? (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">
                              {admin.ds_adm}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Sin dirección
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={admin.st_adm ? "default" : "secondary"}
                          className={admin.st_adm ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                        >
                          {admin.st_adm ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>

                      
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;