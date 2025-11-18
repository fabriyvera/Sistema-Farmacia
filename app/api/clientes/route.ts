import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
    const pool = await connectDB();

    const result = await pool.request().query(`
      SELECT nc_ct, em_ct, tl_ct, ds_ct
      FROM ct_mst
    `);

    return NextResponse.json({
      success: true,
      data: result.recordset,
    });
  } catch (error: unknown) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }, { status: 500 });
  }
}
