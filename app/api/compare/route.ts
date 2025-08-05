import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

// Helper function to generate SHA-256 hash
function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

interface ComparisonResult {
  commonCount: number;
  file1Count: number;
  file2Count: number;
  executionTime: number;
  method: string;
}

// Server-side CSV parsing function
function parseCSVContent(content: string): string[] {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    throw new Error('The file is empty or contains no valid data.');
  }
  
  // Skip header if it exists (first line that starts with 'email')
  const startIndex = lines[0]?.toLowerCase().startsWith('email') ? 1 : 0;
  
  const MAX_EMAILS = 100000000; // 100 million emails max
  const emailCount = lines.length - startIndex;
  
  if (emailCount > MAX_EMAILS) {
    throw new Error(`File contains ${emailCount.toLocaleString()} emails, which exceeds the maximum of ${MAX_EMAILS.toLocaleString()}.`);
  }
  
  // Use plain object for deduplication (no size limits like Map/Set)
  const emailObj: Record<string, boolean> = {};
  const emails: string[] = [];
  
  for (let i = startIndex; i < lines.length; i++) {
    const email = lines[i].trim();
    if (email) {
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.warn(`Skipping invalid email format: ${email}`);
        continue;
      }
      
      const normalizedEmail = email.toLowerCase();
      if (!emailObj[normalizedEmail]) {
        emailObj[normalizedEmail] = true;
        emails.push(normalizedEmail);
      }
    }
  }
  
  if (emails.length === 0) {
    throw new Error('No valid email addresses found in the file.');
  }
  
  return emails;
}

// Helper function for exact comparison
function performExactComparison(emails1: string[], emails2: string[]): number {
  console.log('Starting exact comparison...');
  
  const [smallerEmails, largerEmails] = emails1.length <= emails2.length 
    ? [emails1, emails2] 
    : [emails2, emails1];
  
  const emailSet = new Set(smallerEmails);
  let commonCount = 0;
  
  for (const email of largerEmails) {
    if (emailSet.has(email)) {
      commonCount++;
    }
  }
  
  return commonCount;
}

// Helper function for SHA-256 comparison
function performSha256Comparison(emails1: string[], emails2: string[]): number {
  console.log('Starting SHA-256 comparison...');
  
  const hash1 = new Set(emails1.map(email => sha256(email.toLowerCase().trim())));
  const hash2 = new Set(emails2.map(email => sha256(email.toLowerCase().trim())));
  
  const [smallerHashes, largerHashes] = hash1.size <= hash2.size 
    ? [hash1, hash2] 
    : [hash2, hash1];
  
  let commonCount = 0;
  for (const hash of largerHashes) {
    if (smallerHashes.has(hash)) {
      commonCount++;
    }
  }
  
  return commonCount;
}

// Helper function to perform comparison based on method
function performComparison(emails1: string[], emails2: string[], method: string): number {
  switch (method) {
    case 'exact':
      return performExactComparison(emails1, emails2);
    case 'sha256':
      return performSha256Comparison(emails1, emails2);
    default:
      throw new Error(`Comparison method '${method}' is not implemented yet`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file1 = formData.get('file1') as File;
    const file2 = formData.get('file2') as File;
    const method = formData.get('method') as string || 'exact';
    
    if (!file1 || !file2) {
      return NextResponse.json(
        { error: 'Both files are required' },
        { status: 400 }
      );
    }
    
    console.log(`Starting server-side comparison of ${file1.name} (${file1.size} bytes) and ${file2.name} (${file2.size} bytes)`);
    
    const startTime = performance.now();
    
    // Read and parse file contents
    const [content1, content2] = await Promise.all([
      file1.text(),
      file2.text()
    ]);
    
    console.log('Files read, starting parsing...');
    
    const emails1 = parseCSVContent(content1);
    const emails2 = parseCSVContent(content2);
    
    console.log(`Parsed ${emails1.length} emails from file1 and ${emails2.length} emails from file2`);
    
    // Perform comparison
    const commonCount = performComparison(emails1, emails2, method);
    
    const executionTime = performance.now() - startTime;
    
    console.log(`Comparison completed in ${executionTime.toFixed(2)}ms. Found ${commonCount} common emails.`);
    
    const result: ComparisonResult = {
      commonCount,
      file1Count: emails1.length,
      file2Count: emails2.length,
      executionTime,
      method
    };
    
    return NextResponse.json({
      success: true,
      result
    });
    
  } catch (error) {
    console.error('Comparison error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unknown error occurred during comparison' },
      { status: 500 }
    );
  }
}
