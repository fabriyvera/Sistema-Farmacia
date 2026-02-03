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
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, Mail, Phone, MapPin } from "lucide-react";

interface Cliente {
  nc_ct: string;   
  em_ct: string;   
  tl_ct: string;   
  ds_ct: string;  
}

const ClienteList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/clientes");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.success) {
          setClientes(data.data);
        } else {
          throw new Error(data.message || "Error al cargar datos");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const getInitials = (nombre: string) => {
    const names = nombre.split(" ");
    const initials = names.map(n => n.charAt(0)).join("").toUpperCase();
    return initials.substring(0, 2);
  };

  const filtered = clientes.filter(c => {
    const search = searchTerm.toLowerCase();
    return (
      c.nc_ct.toLowerCase().includes(search) ||
      c.em_ct?.toLowerCase().includes(search) ||
      c.tl_ct?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Listado de Clientes</h1>
        <p className="text-muted-foreground">
          Lista y administración de clientes registrados
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filtered.length} de {clientes.length} clientes
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 rounded-full border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Cargando clientes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No se encontraron clientes
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((c, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{getInitials(c.nc_ct)}</AvatarFallback>
                          </Avatar>
                          <div>{c.nc_ct}</div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-4 w-4" /> {c.em_ct || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-4 w-4" /> {c.tl_ct || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-4 w-4" /> {c.ds_ct || "Sin dirección"}
                        </div>
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

export default ClienteList;
