import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  let pool;
  try {
    const clientData = await request.json();

    const requiredFields = ['nm_ct', 'tl_ct', 'em_ct', 'ds_ct', 'pw_ct', 'nc_ct'];
    const missingFields = requiredFields.filter(field => !clientData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    pool = await connectDB();

    const checkUserQuery = `
      SELECT nm_ct FROM ct_mst WHERE nm_ct = @nm_ct
    `;

    const existingUser = await pool.request()
      .input('nm_ct', clientData.nm_ct)
      .query(checkUserQuery);

    if (existingUser.recordset.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'El username ya está en uso'
        },
        { status: 409 }
      );
    }

    const checkEmailQuery = `
      SELECT em_ct FROM ct_mst WHERE em_ct = @em_ct
    `;

    const existingEmail = await pool.request()
      .input('em_ct', clientData.em_ct)
      .query(checkEmailQuery);

    if (existingEmail.recordset.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'El email ya está registrado'
        },
        { status: 409 }
      );
    }

    const insertQuery = `
      INSERT INTO ct_mst (
        nm_ct, tl_ct, em_ct, ds_ct, pw_ct, nc_ct
      ) VALUES (
        @nm_ct, @tl_ct, @em_ct, @ds_ct, @pw_ct, @nc_ct
      )
    `;

    const result = await pool.request()
      .input('nm_ct', clientData.nm_ct)
      .input('tl_ct', clientData.tl_ct)
      .input('em_ct', clientData.em_ct)
      .input('ds_ct', clientData.ds_ct)
      .input('pw_ct', clientData.pw_ct)
      .input('nc_ct', clientData.nc_ct)
      .query(insertQuery);

    return NextResponse.json(
      { 
        success: true,
        message: 'Cliente registrado correctamente'
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error al registrar cliente:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error al registrar cliente: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}