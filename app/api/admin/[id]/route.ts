import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

// PUT para actualizar un administrador específico
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const adminId = params.id;
    const adminData = await request.json();

    console.log('Actualizando administrador ID:', adminId, 'Datos:', adminData);

    // Validar datos requeridos
    if (!adminData.nm_adm || !adminData.nms_adm || !adminData.app_adm) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Faltan campos obligatorios: nm_adm, nms_adm, app_adm'
        },
        { status: 400 }
      );
    }

    pool = await connectDB();

    const query = `
      UPDATE adm_mst SET
        nm_adm = @nm_adm,
        nms_adm = @nms_adm,
        app_adm = @app_adm,
        apm_adm = @apm_adm,
        fk_rl = @fk_rl,
        fk_sc = @fk_sc,
        st_adm = @st_adm,
        em_adm = @em_adm,
        tl_adm = @tl_adm,
        ds_adm = @ds_adm
      WHERE pk_adm = @pk_adm
    `;

    const result = await pool.request()
      .input('pk_adm', adminId)
      .input('nm_adm', adminData.nm_adm)
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
        success: true,
        message: 'Administrador actualizado correctamente'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error actualizando administrador:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al actualizar administrador: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}

// GET para obtener un administrador específico (opcional, pero útil)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const adminId = params.id;
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
      WHERE pk_adm = @pk_adm
    `;

    const result = await pool.request()
      .input('pk_adm', adminId)
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Administrador no encontrado'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: result.recordset[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error obteniendo administrador:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al obtener administrador: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}