import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  let pool;
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'Username y contraseña son requeridos'
      }, { status: 400 });
    }

    pool = await connectDB();

    const adminResult = await pool.request()
      .input('username', username)
      .input('password', password)
      .query(`
        SELECT 
          pk_adm as id,
          nm_adm as username,
          nms_adm as nombres,
          app_adm as apPaterno,
          apm_adm as apMaterno,
          em_adm as email,
          tl_adm as telefono,
          ds_adm as direccion,
          st_adm as activo,
          fk_rl as rol,
          fk_sc as sucursal
        FROM adm_mst 
        WHERE nm_adm = @username AND pw_adm = @password AND st_adm = 1
      `);

    if (adminResult.recordset.length > 0) {
      return NextResponse.json({
        success: true,
        userType: 'admin',
        user: adminResult.recordset[0]
      });
    }

    const clientResult = await pool.request()
      .input('username', username)
      .input('password', password)
      .query(`
        SELECT 
          pk_ct as id,
          nm_ct as username,
          nc_ct as nombreCompleto,
          em_ct as email,
          tl_ct as telefono,
          ds_ct as direccion
        FROM ct_mst 
        WHERE nm_ct = @username AND pw_ct = @password
      `);

    if (clientResult.recordset.length > 0) {
      return NextResponse.json({
        success: true,
        userType: 'client',
        user: clientResult.recordset[0]
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Credenciales incorrectas'
    }, { status: 401 }); //401=acceso no autorizado

  } catch (error: unknown) {
    console.error('Error en login:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });//500=error interno del servidor
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}