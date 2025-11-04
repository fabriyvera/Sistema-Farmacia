"use client";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react";

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Laura Sánchez",
      role: "Gerente General",
      email: "laura.sanchez@catefarm.com",
      phone: "+52 55 1111 2222",
      department: "Administración",
      status: "Activo",
      initials: "LS"
    },
    {
      id: 2,
      name: "Roberto Flores",
      role: "Supervisor de Inventario",
      email: "roberto.flores@catefarm.com",
      phone: "+52 55 3333 4444",
      department: "Logística",
      status: "Activo",
      initials: "RF"
    },
    {
      id: 3,
      name: "Patricia Ramos",
      role: "Responsable de Compras",
      email: "patricia.ramos@catefarm.com",
      phone: "+52 55 5555 6666",
      department: "Compras",
      status: "Activo",
      initials: "PR"
    },
    {
      id: 4,
      name: "Miguel Torres",
      role: "Contador",
      email: "miguel.torres@catefarm.com",
      phone: "+52 55 7777 8888",
      department: "Finanzas",
      status: "Activo",
      initials: "MT"
    },
    {
      id: 5,
      name: "Carmen Díaz",
      role: "Coordinadora de Atención al Cliente",
      email: "carmen.diaz@catefarm.com",
      phone: "+52 55 9999 0000",
      department: "Servicio al Cliente",
      status: "Vacaciones",
      initials: "CD"
    }
  ]);

  const filteredStaff = staff.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Personal Administrativo</h1>
          <p className="text-muted-foreground">
            Gestiona el personal de la organizacion
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Completa la información del empleado
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffName">Nombre Completo</Label>
                  <Input id="staffName" placeholder="Ej: Juan Pérez López" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffRole">Puesto</Label>
                  <Input id="staffRole" placeholder="Ej: Gerente de Ventas" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="staffEmail">Correo Electrónico</Label>
                  <Input id="staffEmail" type="email" placeholder="empleado@catefarm.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffPhone">Teléfono</Label>
                  <Input id="staffPhone" placeholder="+52 55 1234 5678" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administración</SelectItem>
                      <SelectItem value="logistics">Logística</SelectItem>
                      <SelectItem value="purchases">Compras</SelectItem>
                      <SelectItem value="finance">Finanzas</SelectItem>
                      <SelectItem value="customer">Servicio al Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="staffStatus">Estado</Label>
                  <Select>
                    <SelectTrigger id="staffStatus">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="vacation">Vacaciones</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar Empleado</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Puesto</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
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
                  <TableCell>{person.department}</TableCell>
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
                    <Badge variant={person.status === 'Activo' ? 'default' : 'secondary'}>
                      {person.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Staff;
