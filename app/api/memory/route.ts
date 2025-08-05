import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const usage = process.memoryUsage();
    
    return NextResponse.json({
      rss: usage.rss / 1024 / 1024, // Convert to MB
      heapTotal: usage.heapTotal / 1024 / 1024,
      heapUsed: usage.heapUsed / 1024 / 1024,
      external: usage.external / 1024 / 1024,
      arrayBuffers: usage.arrayBuffers / 1024 / 1024,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting memory usage:', error);
    return NextResponse.json(
      { error: 'Failed to get memory usage' },
      { status: 500 }
    );
  }
}
