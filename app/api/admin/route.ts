import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  let pool;
  try {
    pool = await connectDB();

    const query = `
      SELECT 
        pk_adm,
        nm_adm,
        nms_adm,
        app_adm,
        apm_adm,
        fk_rl,
        fk_sc,
        st_adm,
        em_adm,
        tl_adm,
        ds_adm
      FROM adm_mst
      ORDER BY nms_adm, app_adm
    `;

    const result = await pool.request().query(query);

    return NextResponse.json(
      { 
        success: true,
        data: result.recordset 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error obteniendo administradores:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al obtener administradores: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}




export async function POST(request: NextRequest) {
  let pool;
  try {
    const adminData = await request.json();

    console.log('Datos recibidos en el backend:', adminData);

    // Validar datos requeridos con nombres CORRECTOS
    const requiredFields = ['nm_adm', 'pw_adm', 'nms_adm', 'app_adm'];
    const missingFields = requiredFields.filter(field => !adminData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          message: `Faltan campos obligatorios: ${missingFields.join(', ')}`,
          receivedData: adminData,
          missingFields: missingFields
        },
        { status: 400 }
      );
    }

    // Obtener conexión
    pool = await connectDB();

    // Insertar en la base de datos SQL Server
    const query = `
      INSERT INTO adm_mst (
        nm_adm, pw_adm, nms_adm, app_adm, apm_adm, 
        fk_rl, fk_sc, st_adm, em_adm, tl_adm, ds_adm
      ) VALUES (
        @nm_adm, @pw_adm, @nms_adm, @app_adm, @apm_adm, 
        @fk_rl, @fk_sc, @st_adm, @em_adm, @tl_adm, @ds_adm
      )
    `;

    const result = await pool.request()
      .input('nm_adm', adminData.nm_adm)
      .input('pw_adm', adminData.pw_adm)
      .input('nms_adm', adminData.nms_adm)
      .input('app_adm', adminData.app_adm)
      .input('apm_adm', adminData.apm_adm || null)
      .input('fk_rl', adminData.fk_rl || 0)
      .input('fk_sc', adminData.fk_sc || 0)
      .input('st_adm', adminData.st_adm || 1)
      .input('em_adm', adminData.em_adm || null)
      .input('tl_adm', adminData.tl_adm || null)
      .input('ds_adm', adminData.ds_adm || null)
      .query(query);

    return NextResponse.json(
      { 
        message: 'Administrador registrado correctamente',
        success: true 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar administrador:', error);
    return NextResponse.json(
      { 
        message: 'Error interno del servidor: ' + (error as Error).message,
        success: false
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}