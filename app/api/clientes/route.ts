import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  let pool;
  try {
    pool = await connectDB();

    const query = (`
      SELECT pk_ct, nm_ct, tl_ct, em_ct, ds_ct, nc_ct 
      FROM ct_mst 
      ORDER BY nm_ct
    `);
    const result = await pool.request().query(query);

    return NextResponse.json(
      { 
        success: true,
        data: result.recordset
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }finally {
    if (pool) {
      await pool.close();
    }
    }
  }

