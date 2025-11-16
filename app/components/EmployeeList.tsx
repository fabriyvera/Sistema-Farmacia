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
import { Search, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location?: string;
  status: string;
  initials: string;
}

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios");
        if (!response.ok) throw new Error("Error al obtener datos");
        const data = await response.json();

        const formattedData: Employee[] = data.map((user: any) => ({
          id: user.id,
          name: user.nombre,
          role: user.rol,
          email: user.email,
          phone: user.telefono,
          location: user.direccion,
          status: user.estado,
          initials: user.nombre
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
        }));

        setStaff(formattedData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lista de Empleados</h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todos los empleados de la organización
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-6">
              Cargando empleados...
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Direccion</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>{person.name}</div>
                      </div>
                    </TableCell>

                    <TableCell>{person.role}</TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {person.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {person.phone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {person.location ? (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">
                            {person.location}
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
                        variant={person.status === "Activo" ? "default" : "secondary"}
                      >
                        {person.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeList;