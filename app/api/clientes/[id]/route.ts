import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let pool;
  try {
    const id = params.id;
    pool = await connectDB();

    const query = (`
      SELECT pk_ct, nm_ct, tl_ct, em_ct, ds_ct, nc_ct 
      FROM ct_mst 
      WHERE pk_ct = @id
    `);

    const result = await pool.request()
      .input('id', id)
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Cliente no encontrado'
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
    console.error('Error obteniendo cliente:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Error obteniendo cliente: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (pool) {
      await pool.close();
    }
  }
}