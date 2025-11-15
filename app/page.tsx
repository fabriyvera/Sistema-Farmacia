"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    const userType = sessionStorage.getItem("userType");

    if (userData && userType) {
      setUser(JSON.parse(userData));
      if (userType === "admin") router.push("./admin");
      else router.push("./cliente");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("userType", data.userType);
        if (data.userType === "admin") router.push("./admin");
        else router.push("./cliente");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <h1>Bienvenido a Farmacia App</h1>
        <p>Redirigiendo a tu panel...</p>
        <button
          onClick={() => {
            sessionStorage.clear();
            setUser(null);
          }}
          style={{ marginTop: 20, padding: 10 }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-orange-500 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-center items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">CATEFARM</h1>
        </div>
      </header>

      {/* Main - simple centered login card (estilo anterior) */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50">
        <div
          style={{
            maxWidth: 400,
            width: "100%",
            margin: "0 auto",
            padding: 20,
            border: "1px solid #e6e6e6",
            borderRadius: 8,
            background: "#fff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: 18, fontSize: 20 }}>Farmacia App - Login</h1>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Usuario:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Ingresa tu usuario"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 6 }}>Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ingresa tu contraseña"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer (mantengo el diseño que dejamos, logo grande y columnas) */}
      <footer className="w-full bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative w-36 h-36 mb-3">
              <Image src="/Catedral-Logo-Naranja-Original.png" alt="Logo CATEFARM" fill style={{ objectFit: "contain" }} />
            </div>
            <div className="text-lg font-semibold text-gray-800">CATEFARM</div>
            <div className="text-sm text-gray-500">Sistema de gestión</div>
          </div>

          {/* Categorías */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">Categorías</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Dermatología</li>
              <li>Farmacia y Salud</li>
              <li>Vitaminas</li>
              <li>Ortopedia</li>
              <li>Suplementos</li>
              <li>Cuidado Personal</li>
            </ul>
          </div>

          {/* Redes + contacto */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">Contáctanos</h4>
            <div className="flex justify-center md:justify-start items-center gap-5">
              {/* Facebook */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.14h-1.1c-1.1 0-1.45.68-1.45 1.38V12h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-md text-gray-600 hover:text-pink-500 hover:scale-110 transition"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.9A3.1 3.1 0 1015.1 11 3.1 3.1 0 0012 7.9zm6.4-.6a1.15 1.15 0 11-1.15-1.15A1.15 1.15 0 0118.4 7.3zM12 9.6A2.4 2.4 0 1114.4 12 2.4 2.4 0 0112 9.6z" />
                </svg>
              </a>

              {/* TikTok (versión estándar) */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="p-2 rounded-md text-gray-600 hover:text-black hover:scale-110 transition"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9 3v10.5A4.5 4.5 0 109 3z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
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

        <div className="text-center text-xs text-gray-400 pb-4">© {new Date().getFullYear()} CATEFARM — Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}
