import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { username, password, tipo } = await req.json();

    // URLs de las APIs MockAPI
    const apiUrl =
      tipo === "admin"
        ? "https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios"
        : "https://690a052a1a446bb9cc2104c7.mockapi.io/Clientes";

    // Obtenemos los datos de la API correspondiente
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Verificamos usuario y contraseña
    const user = data.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      return NextResponse.json({
        success: true,
        user,
        tipo,
        message: `Bienvenido ${user.nombre}`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
