// app/components/BranchManagement.tsx
"use client";

import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type BranchStatus = "Activo" | "Suspendido" | "Cerrado";

type Branch = {
  id: string;
  nombre: string;
  direccion: string;
  encargado: string;
  ciudad?: string;
  telefono?: string;
  nroDeTrabajadores: number;
  estado: BranchStatus;
};

export default function BranchManagement() {
  const API_URL = "https://690a052a1a446bb9cc2104c7.mockapi.io/Sucursales";

  const [sucursales, setSucursales] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Panel / formulario
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"new" | "edit">("new");
  const [editing, setEditing] = useState<Branch | null>(null);

  // campos formulario
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [encargado, setEncargado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nroDeTrabajadores, setNroDeTrabajadores] = useState<number | "">("");
  const [estado, setEstado] = useState<BranchStatus>("Activo");

  // Fetch inicial
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const resp = await fetch(API_URL);
        if (!resp.ok) throw new Error("Error al cargar sucursales");
        const data = await resp.json();
        // Mapear a Branch (aseguramos campos)
        const formatted: Branch[] = data.map((item: any) => ({
          id: String(item.id),
          nombre: item.nombre ?? item.Nombre ?? "",
          direccion: item.direccion ?? "",
          encargado: item.encargado ?? "",
          ciudad: item.ciudad ?? "",
          telefono: item.telefono ?? "",
          nroDeTrabajadores: Number(
            item.nroDeTrabajadores ?? item.Nrodetrabajadores ?? item.trabajadores ?? 0
          ),
          estado: (item.estado ?? item.Estado ?? "Activo") as BranchStatus,
        }));
        setSucursales(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
  }, []);

  // Abrir panel nuevo
  const openNew = () => {
    setPanelMode("new");
    setEditing(null);
    setNombre("");
    setDireccion("");
    setEncargado("");
    setCiudad("");
    setTelefono("");
    setNroDeTrabajadores("");
    setEstado("Activo");
    setIsPanelOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Abrir panel editar
  const openEdit = (b: Branch) => {
    setPanelMode("edit");
    setEditing(b);
    setNombre(b.nombre);
    setDireccion(b.direccion);
    setEncargado(b.encargado);
    setCiudad(b.ciudad ?? "");
    setTelefono(b.telefono ?? "");
    setNroDeTrabajadores(b.nroDeTrabajadores);
    setEstado(b.estado);
    setIsPanelOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setEditing(null);
    document.body.style.overflow = "";
  };

  // Guardar (POST o PUT)
  const saveBranch = async () => {
    // validaciones básicas
    if (!nombre.trim() || !direccion.trim() || !encargado.trim()) {
      alert("Completa los campos obligatorios: nombre, dirección y encargado.");
      return;
    }
    const payload = {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      encargado: encargado.trim(),
      ciudad: ciudad.trim(),
      telefono: telefono.trim(),
      nroDeTrabajadores: Number(nroDeTrabajadores) || 0,
      estado,
    };

    try {
      if (panelMode === "edit" && editing) {
        // PUT
        const res = await fetch(`${API_URL}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al actualizar sucursal");
        const updated = await res.json();
        // reflejar en UI (usar estructura Branch)
        const updatedBranch: Branch = {
          id: String(updated.id),
          nombre: updated.nombre,
          direccion: updated.direccion,
          encargado: updated.encargado,
          ciudad: updated.ciudad ?? "",
          telefono: updated.telefono ?? "",
          nroDeTrabajadores: Number(updated.nroDeTrabajadores ?? 0),
          estado: updated.estado as BranchStatus,
        };
        setSucursales((prev) => prev.map((p) => (p.id === editing.id ? updatedBranch : p)));
      } else {
        // POST
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear sucursal");
        const created = await res.json();
        const createdBranch: Branch = {
          id: String(created.id),
          nombre: created.nombre,
          direccion: created.direccion,
          encargado: created.encargado,
          ciudad: created.ciudad ?? "",
          telefono: created.telefono ?? "",
          nroDeTrabajadores: Number(created.nroDeTrabajadores ?? 0),
          estado: created.estado as BranchStatus,
        };
        setSucursales((prev) => [createdBranch, ...prev]);
      }

      closePanel();
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error. Revisa la consola.");
    }
  };

  // Eliminar
  const deleteBranch = async (id: string) => {
    if (!confirm("¿Eliminar esta sucursal?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      setSucursales((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar. Revisa la consola.");
    }
  };

  // Cambiar solo estado (PUT parcial)
  const changeStatus = async (id: string, newStatus: BranchStatus) => {
    try {
      // Traemos la sucursal actual para mantener resto de campos (MockAPI no soporta PATCH fácilmente)
      const b = sucursales.find((s) => s.id === id);
      if (!b) return;
      const payload = {
        nombre: b.nombre,
        direccion: b.direccion,
        encargado: b.encargado,
        ciudad: b.ciudad ?? "",
        telefono: b.telefono ?? "",
        nroDeTrabajadores: b.nroDeTrabajadores,
        estado: newStatus,
      };
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al cambiar estado");
      const updated = await res.json();
      setSucursales((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                estado: (updated.estado ?? newStatus) as BranchStatus,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo cambiar el estado.");
    }
  };

  const statusBadgeClass = (s: BranchStatus) => {
    if (s === "Activo") return "bg-green-100 text-green-700";
    if (s === "Suspendido") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-200 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="text-primary h-7 w-7" />
          <h1 className="text-2xl font-semibold">Gestión de Sucursales</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={openNew} className="inline-flex items-center gap-2 bg-primary text-white">
            <PlusCircle className="h-4 w-4" />
            Añadir Sucursal
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground">Cargando sucursales...</p>
      ) : sucursales.length === 0 ? (
        <p className="text-center text-muted-foreground">No hay sucursales registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sucursales.map((b) => (
            <div key={b.id} className="border border-border rounded-xl p-4 bg-muted shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-medium">{b.nombre}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(b.estado)}`}>
                    {b.estado}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">📍 {b.direccion}</p>
                <p className="text-sm text-muted-foreground">👤 {b.encargado}</p>
                {b.ciudad && <p className="text-sm text-muted-foreground">🏙️ {b.ciudad}</p>}
                {b.telefono && <p className="text-sm text-muted-foreground">📞 {b.telefono}</p>}
                <p className="text-sm text-muted-foreground">👥 {b.nroDeTrabajadores} trabajadores</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => openEdit(b)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border hover:bg-white/5">
                  <Pencil className="h-4 w-4" /> Editar
                </button>

                <button onClick={() => deleteBranch(b.id)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border hover:bg-red-50 text-red-600">
                  <Trash className="h-4 w-4" /> Eliminar
                </button>

                <div className="ml-auto">
                  <select
                    value={b.estado}
                    onChange={(e) => changeStatus(b.id, e.target.value as BranchStatus)}
                    className="rounded-md border border-border bg-input px-2 py-1 text-sm"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Suspendido">Suspendido</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Panel lateral para crear / editar */}
      {isPanelOpen && (
        <>
          <div onClick={closePanel} className="fixed inset-0 bg-black/30 z-40" />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-xl p-6 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{panelMode === "edit" ? "Editar Sucursal" : "Nueva Sucursal"}</h3>
              <button onClick={closePanel} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveBranch();
              }}
              className="space-y-4"
            >
              <div>
                <Label>Nombre</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Sucursal Centro" required />
              </div>

              <div>
                <Label>Dirección</Label>
                <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección completa" required />
              </div>

              <div>
                <Label>Encargado</Label>
                <Input value={encargado} onChange={(e) => setEncargado(e.target.value)} placeholder="Nombre del encargado" required />
              </div>

              <div>
                <Label>Ciudad</Label>
                <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="La Paz" />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="+591 ..." />
              </div>

              <div>
                <Label>N° de Trabajadores</Label>
                <Input type="number" min={0} value={nroDeTrabajadores} onChange={(e) => setNroDeTrabajadores(e.target.value === "" ? "" : Number(e.target.value))} placeholder="0" />
              </div>

              <div>
                <Label>Estado</Label>
                <select value={estado} onChange={(e) => setEstado(e.target.value as BranchStatus)} className="w-full rounded-md border border-border px-3 py-2 bg-input">
                  <option value="Activo">Activo</option>
                  <option value="Suspendido">Suspendido</option>
                  <option value="Cerrado">Cerrado</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button type="button" onClick={closePanel} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white">{panelMode === "edit" ? "Guardar cambios" : "Crear sucursal"}</button>
              </div>
            </form>
          </aside>
        </>
      )}
    </div>
  );
}
