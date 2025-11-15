"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("userType", data.userType);

        if (data.userType === "admin") {
          router.push("./admin");
        } else {
          router.push("./cliente");
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Bienvenido a Farmacia App</h1>
        <p>Redirigiendo a tu panel...</p>
        <button
          onClick={() => {
            sessionStorage.clear();
            setUser(null);
          }}
          style={{ marginTop: "20px", padding: "10px" }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="w-full bg-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center relative">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-wide">
           CATEFARM
          </h1>
        </div>
      </header>


      {/* MAIN: card centrado */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 bg-white">
          {/* LEFT: logo area (fondo suave naranja) */}
          <div className="hidden md:flex items-center justify-center bg-orange-50 p-10">
            <div className="w-72 h-72 relative">
              <Image
                src="/Catedral-Logo-Naranja-Original.png"
                alt="Catedral logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* RIGHT: formulario (usa tu lógica original) */}
          <div className="p-10 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Bienvenido a Catefarm</h2>
            <p className="text-gray-600 mb-6">Introduce tu usuario y contraseña para iniciar sesión.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Ingresa tu usuario"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-medium shadow-sm transition"
              >
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <button onClick={() => alert("Redirigir a registro (implementar)")} className="text-orange-600 font-medium hover:underline">
                Regístrate
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative w-36 h-36 mb-3">
              <Image
                src="/Catedral-Logo-Naranja-Original.png"
                alt="Logo CATEFARM"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <div className="text-lg font-semibold text-gray-800">CATEFARM</div>
            <div className="text-sm text-gray-500">Sistema de gestión</div>
          </div>

          {/* Contacto */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-gray-700 mb-3">Contáctanos</h4>

            <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
              {/* Redes */}
              <a className="p-2 text-gray-600 hover:text-blue-600 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2V12h2.2V9.7c0-2.2 1.3-3.4 3.3-3.4.95 0 1.95.17 1.95.17v2.14h-1.1c-1.1 0-1.45.68-1.45 1.38V12h2.5l-.4 2.9h-2.1v7A10 10 0 0022 12z"/></svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-pink-500 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.9A3.1 3.1 0 1015.1 11 3.1 3.1 0 0012 7.9zm6.4-.6a1.15 1.15 0 11-1.15-1.15A1.15 1.15 0 0118.4 7.3z"/></svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-black hover:scale-110 transition">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.6 2.1v7.6c0 .1 0 .2.1.3 0 2.1-1.6 3.8-3.7 3.8-2.1 0-3.7-1.7-3.7-3.8s1.6-3.8 3.7-3.8c.5 0 1 .1 1.4.3V4.1c-.5-.2-1-.3-1.4-.3C8 3.8 6 5.8 6 8.3 6 10.9 8 13 10.6 13c2.4 0 4.3-1.9 4.3-4.3V2.1h-2.3z" />
                </svg>
              </a>

              <a className="p-2 text-gray-600 hover:text-sky-700 hover:scale-110 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.6 4.06 5.5 2.98 5.5S1 4.6 1 3.5 1.92 1.5 3 1.5 4.98 2.4 4.98 3.5zM1.5 8.5h3v12h-3v-12zM8.5 8.5h2.9v1.6h.1c.4-.8 1.6-1.6 3.3-1.6 3.5 0 4.2 2.3 4.2 5.3v6.7h-3v-6c0-1.4 0-3.2-2-3.2-2 0-2.3 1.5-2.3 3v6.2h-3v-12z"/></svg>
              </a>
            </div>

            <div className="text-sm text-gray-500">
              <div>Tel: +591 7XX XXXX</div>
              <div>contacto@catefarm.com</div>
            </div>
          </div>

          {/* Categorías */}
          <div className="text-right md:text-right">
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
        </div>

        <div className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} CATEFARM — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}



//Credenciales de prueba:Administrador: admin01 / AdminPass2025!

//Cliente: cmendoza / 12345