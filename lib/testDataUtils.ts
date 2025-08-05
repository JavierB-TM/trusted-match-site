// lib/testDataUtils.ts

// Helper function to generate random emails
export const generateRandomEmail = (): string => {
  const usernames = ['user', 'client', 'customer', 'test', 'demo', 'example'];
  const domains = ['example.com', 'test.org', 'demo.net', 'mail.io', 'domain.co'];
  const randomStr = Math.random().toString(36).substring(2, 8);
  const username = `${usernames[Math.floor(Math.random() * usernames.length)]}${randomStr}`;
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
};

// Generate a chunk of emails
export const generateEmailChunk = (count: number, uniqueEmails: Set<string>): string[] => {
  const emails: string[] = [];
  while (emails.length < count) {
    const email = generateRandomEmail();
    if (!uniqueEmails.has(email)) {
      uniqueEmails.add(email);
      emails.push(email);
    }
  }
  return emails;
};

// Shuffle array function
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export interface TestDataResult {
  file1Emails: string[];
  file2Emails: string[];
  commonEmails: string[];
}

export interface GenerateTestDataOptions {
  size1: number;
  size2: number;
  intersectionPercent: number;
}

export const generateTestData = (size1: number, size2: number, intersectionPercent: number) => {
  // Input validation
  if (size1 <= 0 || size2 <= 0 || intersectionPercent < 0 || intersectionPercent > 100) {
    throw new Error('Invalid input parameters. Sizes must be positive and intersection must be between 0 and 100.');
  }

  const MAX_EMAILS = 100000000; // 100 million emails max per file
  const SET_SIZE_LIMIT = 5000000; // Conservative limit for Set size (5M) - much safer threshold
  
  if (size1 > MAX_EMAILS || size2 > MAX_EMAILS) {
    throw new Error(`Maximum size per file is ${MAX_EMAILS.toLocaleString()} emails. Please reduce the requested size.`);
  }

  // Calculate number of common emails (round down to ensure we don't exceed requested sizes)
  const commonCount = Math.min(
    Math.floor(size1 * (intersectionPercent / 100)),
    size1,
    size2
  );

  // For datasets over 5M emails, use array-based generation to avoid Set limits
  const useArrayGeneration = size1 > SET_SIZE_LIMIT || size2 > SET_SIZE_LIMIT;

  if (useArrayGeneration) {
    // Array-based generation for large datasets
    const file1Emails: string[] = [];
    const file2Emails: string[] = [];
    
    // Generate common emails
    for (let i = 0; i < commonCount; i++) {
      const email = `common${i}@example.com`;
      file1Emails.push(email);
      file2Emails.push(email);
    }
    
    // Generate unique emails for file 1
    for (let i = commonCount; i < size1; i++) {
      file1Emails.push(`user1_${i}@example.com`);
    }
    
    // Generate unique emails for file 2
    for (let i = commonCount; i < size2; i++) {
      file2Emails.push(`user2_${i}@example.com`);
    }
    
    // Shuffle arrays (using a more memory-efficient approach for large arrays)
    const shuffleInPlace = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
    
    shuffleInPlace(file1Emails);
    shuffleInPlace(file2Emails);
    
    return {
      file1Content: ['email', ...file1Emails].join('\n'),
      file2Content: ['email', ...file2Emails].join('\n'),
      stats: {
        file1Count: file1Emails.length,
        file2Count: file2Emails.length,
        commonCount: commonCount,
        actualIntersection: (commonCount / Math.min(file1Emails.length, file2Emails.length)) * 100
      }
    };
  } else {
    // Set-based generation for smaller datasets (more random but has size limits)
    const commonEmails = new Set<string>();
    const file1Emails = new Set<string>();
    const file2Emails = new Set<string>();

    // Generate common emails
    while (commonEmails.size < commonCount) {
      const random = Math.random().toString(36).substring(2, 10);
      const email = `user${random}@example.com`;
      commonEmails.add(email);
    }

    // Add common emails to both files
    commonEmails.forEach(email => {
      file1Emails.add(email);
      file2Emails.add(email);
    });

    // Generate unique emails for file 1
    while (file1Emails.size < size1) {
      const random = Math.random().toString(36).substring(2, 12);
      const email = `user1_${random}@example.com`;
      file1Emails.add(email);
    }

    // Generate unique emails for file 2
    while (file2Emails.size < size2) {
      const random = Math.random().toString(36).substring(2, 12);
      const email = `user2_${random}@example.com`;
      file2Emails.add(email);
    }

    // Convert sets to arrays for easier handling
    const file1Array = Array.from(file1Emails);
    const file2Array = Array.from(file2Emails);

    // Shuffle the arrays to randomize the order
    const shuffle = (array: string[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return {
      file1Content: ['email', ...shuffle(file1Array)].join('\n'),
      file2Content: ['email', ...shuffle(file2Array)].join('\n'),
      stats: {
        file1Count: file1Array.length,
        file2Count: file2Array.length,
        commonCount: commonEmails.size,
        actualIntersection: (commonEmails.size / Math.min(file1Array.length, file2Array.length)) * 100
      }
    };
  }
};

// Helper function to convert emails to CSV content
export const emailsToCsv = (emails: string[]): string => {
  const csvHeader = 'email\r\n';
  return csvHeader + emails.join('\r\n');
};
