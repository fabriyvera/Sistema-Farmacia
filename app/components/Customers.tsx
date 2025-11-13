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
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Plus, Search, Edit, Trash2, Mail, Phone, ShoppingBag } from "lucide-react";

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "María Guadalupe Hernández",
      email: "maria.hernandez@email.com",
      phone: "+591 72154677",
      address: "Calle 5 de Mayo #123, La Paz",
      registrationDate: "2024-01-15",
      totalPurchases: 15,
      totalSpent: 4850.00,
      status: "Activo",
      initials: "MH"
    },
    {
      id: 2,
      name: "José Luis Rodríguez",
      email: "jose.rodriguez@email.com",
      phone: "+591 711514677",
      address: "Av. Juárez #456, La Paz",
      registrationDate: "2024-03-22",
      totalPurchases: 8,
      totalSpent: 2340.00,
      status: "Activo",
      initials: "JR"
    },
    {
      id: 3,
      name: "Ana Patricia Morales",
      email: "ana.morales@email.com",
      phone: "+591 71234677",
      address: "Blvd. Constitución #789, La Paz",
      registrationDate: "2023-11-10",
      totalPurchases: 32,
      totalSpent: 12450.00,
      status: "VIP",
      initials: "AM"
    },
    {
      id: 4,
      name: "Carlos Alberto Gómez",
      email: "carlos.gomez@email.com",
      phone: "+591 73434277",
      address: "Calle Hidalgo #321, La Paz",
      registrationDate: "2024-06-05",
      totalPurchases: 5,
      totalSpent: 1250.00,
      status: "Activo",
      initials: "CG"
    },
    {
      id: 5,
      name: "Sofía Isabel Martínez",
      email: "sofia.martinez@email.com",
      phone: "+591 71213433",
      address: "Av. Patria #654, La Paz",
      registrationDate: "2024-02-18",
      totalPurchases: 22,
      totalSpent: 8920.00,
      status: "VIP",
      initials: "SM"
    },
    {
      id: 6,
      name: "Roberto Sánchez Cruz",
      email: "roberto.sanchez@email.com",
      phone: "+591 72542211",
      address: "Calle Morelos #987, La Paz",
      registrationDate: "2024-08-30",
      totalPurchases: 2,
      totalSpent: 560.00,
      status: "Nuevo",
      initials: "RS"
    }
  ]);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "default";
      case "Activo":
        return "secondary";
      case "Nuevo":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra la base de datos de clientes
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa la información del cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre Completo</Label>
                <Input id="customerName" placeholder="Ej: María Guadalupe Hernández" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Correo Electrónico</Label>
                  <Input id="customerEmail" type="email" placeholder="cliente@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Teléfono</Label>
                  <Input id="customerPhone" placeholder="+52 55 1234 5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerAddress">Dirección</Label>
                <Input id="customerAddress" placeholder="Calle, número, ciudad" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancelar</Button>
              <Button>Guardar Cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Total Clientes</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{customers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Clientes VIP</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{customers.filter(c => c.status === 'VIP').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm text-muted-foreground">Nuevos este Mes</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{customers.filter(c => c.status === 'Nuevo').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
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
                <TableHead>Cliente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Compras</TableHead>
                <TableHead>Total Gastado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {customer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>{customer.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs">{customer.address}</TableCell>
                  <TableCell className="text-sm">{customer.registrationDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      {customer.totalPurchases}
                    </div>
                  </TableCell>
                  <TableCell className="text-primary">
                    Bs. {customer.totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(customer.status)}>
                      {customer.status}
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

export default Customers;
