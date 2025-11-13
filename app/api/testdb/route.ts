import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT @@VERSION as version');
    
    return NextResponse.json({ 
      success: true, 
      version: result.recordset[0].version 
    });
  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}