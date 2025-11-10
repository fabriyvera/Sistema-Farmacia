import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const pool = await connectDB();

    // Importar clientes desde la API mock
    const clientesResponse = await fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Clientes');
    const clientes = await clientesResponse.json();

    for (const cliente of clientes) {
      await pool.request()
        .input('nm_ct', cliente.username)
        .input('em_ct', cliente.email)
        .input('tl_ct', cliente.telefono)
        .input('ds_ct', cliente.direccion)
        .input('pw_ct', cliente.password)
        .input('nc_ct', cliente.nombre)
        .query(`
          INSERT INTO ct_mst (nm_ct, em_ct, tl_ct, ds_ct, pw_ct, nc_ct) 
          VALUES (@nm_ct, @em_ct, @tl_ct, @ds_ct, @pw_ct, @nc_ct)
        `);
    }

    // Importar usuarios desde la API mock
    const usuariosResponse = await fetch('https://690a052a1a446bb9cc2104c7.mockapi.io/Usuarios');
    const usuarios = await usuariosResponse.json();

    for (const usuario of usuarios) {
      await pool.request()
        .input('nm_us', usuario.username)
        .input('pw_us', usuario.password)
        .input('nc_us', usuario.nombre)
        .input('fk_rl', 0) // Valor por defecto para rol
        .input('fk_sc', 0) // Valor por defecto para sucursal
        .input('st_us', usuario.estado === 'Activo' ? 1 : 0)
        .input('em_us', usuario.email)
        .input('tl_us', usuario.telefono)
        .query(`
          INSERT INTO us_mst (nm_us, pw_us, nc_us, fk_rl, fk_sc, st_us, em_us, tl_us) 
          VALUES (@nm_us, @pw_us, @nc_us, @fk_rl, @fk_sc, @st_us, @em_us, @tl_us)
        `);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Datos importados correctamente' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}