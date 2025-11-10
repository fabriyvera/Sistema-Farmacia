import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const pool = await connectDB();

    // Buscar en usuarios (administradores)
    const usuarioResult = await pool.request()
      .input('username', username)
      .input('password', password)
      .query('SELECT * FROM us_mst WHERE nm_us = @username AND pw_us = @password AND st_us = 1');

    if (usuarioResult.recordset.length > 0) {
      return NextResponse.json({
        success: true,
        userType: 'admin',
        user: usuarioResult.recordset[0]
      });
    }

    // Buscar en clientes
    const clienteResult = await pool.request()
      .input('username', username)
      .input('password', password)
      .query('SELECT * FROM ct_mst WHERE nm_ct = @username AND pw_ct = @password');

    if (clienteResult.recordset.length > 0) {
      return NextResponse.json({
        success: true,
        userType: 'client',
        user: clienteResult.recordset[0]
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Credenciales incorrectas'
    }, { status: 401 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}