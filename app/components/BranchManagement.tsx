// app/components/BranchManagement.tsx
"use client";
import React, { useEffect, useState } from "react";
import { PlusCircle, Building2, Trash, Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type BranchStatus = "active" | "suspended" | "closed";

type Branch = {
  id: number;
  name: string;
  address: string;
  manager: string;
  employees: number;
  status: BranchStatus;
};

export default function BranchManagement() {
  const initialBranches: Branch[] = [
    { id: 1, name: "Sucursal Ballivián 20", address: "Calle 20 Av. Ballivian", manager: "Carlos Pérez", employees: 6, status: "active" },
    { id: 2, name: "Sucursal Ballivián 10", address: "Calle 10 Av. Ballivian", manager: "Ana López", employees: 4, status: "active" },
    { id: 3, name: "Sucursal Ballivián 9", address: "Calle 9 Av. Ballivian", manager: "Encargado C", employees: 5, status: "suspended" },
    { id: 4, name: "Sucursal Sánchez Bustamante", address: "Av. Sanchez Bustamante", manager: "Encargado D", employees: 7, status: "active" },
    { id: 5, name: "Sucursal Achumani", address: "Calle 15 Achumani Av. Garcia Lanza", manager: "Encargado E", employees: 3, status: "active" },
  ];

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<"new" | "edit">("new");
  const [editing, setEditing] = useState<Branch | null>(null);

  // form
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [manager, setManager] = useState("");
  const [employees, setEmployees] = useState<number | "">("");
  const [status, setStatus] = useState<BranchStatus>("active");

  useEffect(() => {
    if (isPanelOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isPanelOpen]);

  function openNew() {
    setPanelMode("new");
    setEditing(null);
    setName("");
    setAddress("");
    setManager("");
    setEmployees("");
    setStatus("active");
    setIsPanelOpen(true);
  }

  function openEdit(b: Branch) {
    setPanelMode("edit");
    setEditing(b);
    setName(b.name);
    setAddress(b.address);
    setManager(b.manager);
    setEmployees(b.employees);
    setStatus(b.status);
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
    setEditing(null);
  }

  function saveBranch() {
    // validations
    if (!name.trim()) return alert("Ingresa el nombre de la sucursal.");
    if (!address.trim()) return alert("Ingresa la dirección.");
    if (!manager.trim()) return alert("Ingresa el nombre del encargado.");
    const emp = typeof employees === "number" ? employees : Number(employees);
    if (!Number.isFinite(emp) || emp < 0) return alert("Ingresa una cantidad válida de trabajadores.");

    if (panelMode === "edit" && editing) {
      setBranches(prev => prev.map(b => b.id === editing.id ? { ...b, name: name.trim(), address: address.trim(), manager: manager.trim(), employees: emp, status } : b));
    } else {
      const nextId = branches.length ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
      const newBranch: Branch = { id: nextId, name: name.trim(), address: address.trim(), manager: manager.trim(), employees: emp, status };
      setBranches(prev => [newBranch, ...prev]);
    }

    closePanel();
  }

  function deleteBranch(id: number) {
    if (!confirm("¿Eliminar esta sucursal? Esta acción no se puede deshacer.")) return;
    setBranches(prev => prev.filter(b => b.id !== id));
  }

  function changeStatus(id: number, newStatus: BranchStatus) {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  }

  function statusBadge(s: BranchStatus) {
    if (s === "active") return "bg-green-100 text-green-700";
    if (s === "suspended") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  }

  return (
    <>
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Gestión de Sucursales
          </CardTitle>

          <div className="flex items-center gap-2">
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <PlusCircle className="h-5 w-5" />
              Añadir Sucursal
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {branches.length === 0 ? (
            <p className="text-muted-foreground">No hay sucursales registradas.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map((b) => (
                <div key={b.id} className="border border-border rounded-xl p-4 bg-muted shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-medium">{b.name}</h2>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusBadge(b.status)}`}>{b.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">📍 {b.address}</p>
                    <p className="text-sm text-muted-foreground">👤 {b.manager}</p>
                    <p className="text-sm text-muted-foreground">👥 {b.employees} trabajadores</p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border hover:bg-white/5"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      onClick={() => deleteBranch(b.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border hover:bg-red-50 text-red-600"
                      title="Eliminar"
                    >
                      <Trash className="h-4 w-4" />
                      Eliminar
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <select
                        aria-label="Cambiar estado"
                        value={b.status}
                        onChange={(e) => changeStatus(b.id, e.target.value as BranchStatus)}
                        className="rounded-md border border-border bg-input px-2 py-1 text-sm"
                      >
                        <option value="active">Activo</option>
                        <option value="suspended">Suspendido</option>
                        <option value="closed">Cerrado</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slide-over panel para crear/editar */}
      {isPanelOpen && (
        <>
          <div onClick={closePanel} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" aria-hidden />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-xl p-6 overflow-auto" role="dialog" aria-modal="true">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{panelMode === "edit" ? "Editar Sucursal" : "Nueva Sucursal"}</h3>
              <button onClick={closePanel} className="text-muted-foreground hover:text-foreground">Cerrar ✕</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveBranch(); }} className="space-y-4">
              <div>
                <label className="text-sm block mb-1">Nombre</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 bg-input" placeholder="Ej: Sucursal Centro" required />
              </div>

              <div>
                <label className="text-sm block mb-1">Dirección</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 bg-input" placeholder="Dirección completa" required />
              </div>

              <div>
                <label className="text-sm block mb-1">Encargado</label>
                <input value={manager} onChange={(e) => setManager(e.target.value)} className="w-full rounded-md border border-border px-3 py-2 bg-input" placeholder="Nombre del encargado" required />
              </div>

              <div>
                <label className="text-sm block mb-1">Número de trabajadores</label>
                <input type="number" min={0} value={employees} onChange={(e) => setEmployees(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-md border border-border px-3 py-2 bg-input" placeholder="0" required />
              </div>

              <div>
                <label className="text-sm block mb-1">Estado</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as BranchStatus)} className="w-full rounded-md border border-border px-3 py-2 bg-input">
                  <option value="active">Activo</option>
                  <option value="suspended">Suspendido</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button type="button" onClick={closePanel} className="px-4 py-2 rounded-md border border-border">Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary text-white">Guardar</button>
              </div>
            </form>
          </aside>
        </>
      )}
    </>
  );
}