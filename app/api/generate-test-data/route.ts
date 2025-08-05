import { NextRequest, NextResponse } from 'next/server';
import { generateTestData } from '@/lib/testDataUtils';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { size1, size2, intersection } = await request.json();
    
    // Input validation
    if (typeof size1 !== 'number' || typeof size2 !== 'number' || typeof intersection !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide size1, size2, and intersection as numbers.' },
        { status: 400 }
      );
    }

    try {
      // Generate test data
      const { file1Content, file2Content, stats } = generateTestData(size1, size2, intersection);
      
      // Create public directory if it doesn't exist
      const publicDir = path.join(process.cwd(), 'public', 'test-data');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Generate unique filenames with timestamps
      const timestamp = Date.now();
      const file1Filename = `test_data_1_${timestamp}.csv`;
      const file2Filename = `test_data_2_${timestamp}.csv`;
      const file1Path = path.join(publicDir, file1Filename);
      const file2Path = path.join(publicDir, file2Filename);

      // Write files
      fs.writeFileSync(file1Path, file1Content);
      fs.writeFileSync(file2Path, file2Content);

      return NextResponse.json({
        success: true,
        files: {
          file1: { 
            url: `/test-data/${file1Filename}`, 
            filename: file1Filename, 
            size: file1Content.length,
            stats: {
              totalEmails: stats.file1Count,
              commonEmails: stats.commonCount
            }
          },
          file2: { 
            url: `/test-data/${file2Filename}`, 
            filename: file2Filename, 
            size: file2Content.length,
            stats: {
              totalEmails: stats.file2Count,
              commonEmails: stats.commonCount
            }
          },
        },
        stats: {
          actualIntersection: stats.actualIntersection.toFixed(2) + '%',
          requestedIntersection: intersection + '%'
        }
      });
      
    } catch (error) {
      console.error('Error generating test data:', error);
      if (error instanceof Error) {
        if (error.message.includes('Maximum size per file')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
      }
      throw error; // Let the outer catch handle other errors
    }
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate test data. Please try again with valid parameters.' },
      { status: 500 }
    );
  }
}
