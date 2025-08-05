// app/compare/page.tsx
'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useCallback } from 'react';
import { generateTestData } from '@/lib/testDataUtils';

type ComparisonMethod = 'exact' | 'fuzzy' | 'encrypted' | 'hashed' | 'sha256';

interface MethodInfo {
  name: string;
  description: string;
  requiresKeyPair: boolean;
}

const METHODS: Record<ComparisonMethod, MethodInfo> = {
  exact: {
    name: 'Exact Match',
    description: 'Performs a direct comparison of records',
    requiresKeyPair: false,
  },
  fuzzy: {
    name: 'Fuzzy Match',
    description: 'Matches records with similar but not identical data',
    requiresKeyPair: false,
  },
  encrypted: {
    name: 'Encrypted Comparison',
    description: 'Compares encrypted data using homomorphic encryption',
    requiresKeyPair: true,
  },
  hashed: {
    name: 'Hashed Comparison',
    description: 'Compares cryptographic hashes of records',
    requiresKeyPair: true,
  },
  sha256: {
    name: 'SHA-256 Hash',
    description: 'Compares SHA-256 hashes of email addresses',
    requiresKeyPair: false,
  },
};

const parseCSV = async (file: File): Promise<string[]> => {
  try {
    let text: string;
    try {
      text = await file.text();
    } catch (error) {
      throw new Error('Failed to read file. The file might be corrupted or in an unsupported format.');
    }

    // Split by newlines and filter out empty lines
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    
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
    
    // Return array of unique emails directly
    return emails;
  } catch (error) {
    if (error instanceof Error) {
      // Re-throw with more context if it's our error
      if (error.message.startsWith('No valid email') ||
          error.message.startsWith('File contains')) {
        throw error;
      }
      // For other errors, provide a more user-friendly message
      throw new Error(`Error processing file '${file.name}': ${error.message}`);
    }
    throw new Error('An unknown error occurred while processing the file.');
  }
};

export default function ComparePage() {
  const [selectedMethod, setSelectedMethod] = useState<ComparisonMethod>('exact');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [keyPair, setKeyPair] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [useTestData, setUseTestData] = useState(false);
  const [testConfig, setTestConfig] = useState({
    size1: 1000,
    size2: 1000,
    intersection: 30, // percentage
  });
  const [comparisonResult, setComparisonResult] = useState<{
    commonCount: number;
    file1Count: number;
    file2Count: number;
    executionTime: number;
  } | null>(null);
  
  // Add hydration safety
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [memoryUsage, setMemoryUsage] = useState<{
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
    timestamp?: string;
  } | null>(null);

  // Function to update memory usage
  const updateMemoryUsage = useCallback(async () => {
    if (!isClient) return;
    
    try {
      const response = await fetch('/api/memory');
      if (response.ok) {
        const data = await response.json();
        setMemoryUsage({
          ...data,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to fetch memory usage:', error);
    }
  }, [isClient]);

  // Initial fetch on component mount
  useEffect(() => {
    if (isClient) {
      updateMemoryUsage();
    }
  }, [isClient, updateMemoryUsage]);

  const file1Ref = useRef<HTMLInputElement>(null);
  const file2Ref = useRef<HTMLInputElement>(null);

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(e.target.value as ComparisonMethod);
    setKeyPair(null); // Reset key pair when method changes
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    const file = e.target.files?.[0] || null;
    if (fileNumber === 1) {
      setFile1(file);
    } else {
      setFile2(file);
    }
  };

  const generateKeyPair = () => {
    // In a real implementation, this would generate actual keys
    // For the prototype, we'll use placeholder values
    const newKeyPair = {
      publicKey: `public-key-${Date.now()}`,
      privateKey: `private-key-${Date.now()}`,
    };
    setKeyPair(newKeyPair);
  };

  // Generate test data files with specified intersection using the shared utility
  const generateTestDataFiles = async () => {
    setIsGenerating(true);
    setResult('Generating test data...');
    
    try {
      const { size1, size2, intersection } = testConfig;
      
      // Use the shared utility to generate test data
      const { file1Content, file2Content, stats } = generateTestData(size1, size2, intersection);

      // Create file objects from the generated content
      const createFile = (content: string, filename: string) => {
        return new File([content], filename, { type: 'text/csv' });
      };

      setFile1(createFile(file1Content, 'test_data_1.csv'));
      setFile2(createFile(file2Content, 'test_data_2.csv'));
      
      setResult(`Generated test data with ${stats.file1Count} emails in file 1, ${stats.file2Count} in file 2, and ${stats.commonCount} common emails (${stats.actualIntersection.toFixed(1)}% intersection).`);
    } catch (error) {
      console.error('Error generating test data:', error);
      if (error instanceof Error) {
        setResult(`Failed to generate test data: ${error.message}`);
      } else {
        setResult('Failed to generate test data. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestConfig(prev => ({
      ...prev,
      [name]: Math.max(1, parseInt(value) || 1) // Only ensure minimum of 1, no upper limit
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);
    setComparisonResult(null);

    try {
      let file1ToUse = file1;
      let file2ToUse = file2;
      let resultMessage = '';

      // Generate test data if requested
      if (useTestData) {
        setIsGenerating(true);
        try {
          const testData = generateTestData(testConfig.size1, testConfig.size2, testConfig.intersection);
          
          // Create blob files from the generated content
          file1ToUse = new File([testData.file1Content], 'test_data_1.csv', { type: 'text/csv' });
          file2ToUse = new File([testData.file2Content], 'test_data_2.csv', { type: 'text/csv' });
          
          console.log('Generated test data:', testData.stats);
        } catch (testError) {
          console.error('Test data generation failed:', testError);
          setError(testError instanceof Error ? testError.message : 'Failed to generate test data');
          return;
        } finally {
          setIsGenerating(false);
        }
      }

      if (!file1ToUse || !file2ToUse) {
        setError('Please select both files to compare.');
        return;
      }

      // Use server-side comparison API
      const formData = new FormData();
      formData.append('file1', file1ToUse);
      formData.append('file2', file2ToUse);
      formData.append('method', selectedMethod);

      console.log(`Sending files to server for comparison: ${file1ToUse.name} (${file1ToUse.size} bytes) and ${file2ToUse.name} (${file2ToUse.size} bytes)`);

      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Comparison failed');
      }

      if (data.success && data.result) {
        const { commonCount, file1Count, file2Count, executionTime, method } = data.result;
        
        setComparisonResult({
          commonCount,
          file1Count,
          file2Count,
          executionTime
        });
        
        resultMessage = `Found ${commonCount} matching emails between the files using ${method} match.`;
      } else {
        throw new Error('Invalid response from server');
      }

      setResult(resultMessage);
    } catch (error) {
      console.error('Error during comparison:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during comparison');
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      // Update memory usage after task completes
      await updateMemoryUsage();
    }
  };

  const methodInfo = METHODS[selectedMethod];

  // Don't render the form until we're on the client side
  if (!isClient) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Data Files</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Datasets</h1>
        <p className="text-sm text-gray-600">
          Securely compare two datasets using different matching methods
        </p>
      </div>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Test Data Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useTestData"
                checked={useTestData}
                onChange={(e) => setUseTestData(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="useTestData" className="ml-2 block text-sm font-medium text-gray-700">
                Generate test data instead of uploading files
              </label>
            </div>

            {/* Test Data Configuration */}
            {useTestData && (
              <div className="p-4 bg-blue-50 rounded-md space-y-4">
                <h3 className="text-sm font-medium text-blue-800">Test Data Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="size1" className="block text-xs font-medium text-blue-700">
                      File 1 Size (emails)
                    </label>
                    <input
                      type="number"
                      id="size1"
                      name="size1"
                      min="1"
                      value={testConfig.size1}
                      onChange={handleTestConfigChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="size2" className="block text-xs font-medium text-blue-700">
                      File 2 Size (emails)
                    </label>
                    <input
                      type="number"
                      id="size2"
                      name="size2"
                      min="1"
                      value={testConfig.size2}
                      onChange={handleTestConfigChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="intersection" className="block text-xs font-medium text-blue-700">
                      Intersection (%)
                    </label>
                    <input
                      type="number"
                      id="intersection"
                      name="intersection"
                      min="0"
                      max="100"
                      value={testConfig.intersection}
                      onChange={handleTestConfigChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={generateTestDataFiles}
                  disabled={isGenerating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Generate Test Data'}
                </button>
              </div>
            )}

            {/* Method Selection */}
            <div>
              <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
                Comparison Method
              </label>
              <select
                id="method"
                value={selectedMethod}
                onChange={handleMethodChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              >
                {Object.entries(METHODS).map(([value, { name }]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {methodInfo.description}
              </p>
            </div>

            {/* File Upload 1 */}
            <div className={useTestData ? 'opacity-50' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Dataset
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  ref={file1Ref}
                  onChange={(e) => handleFileChange(e, 1)}
                  className="hidden"
                  disabled={useTestData}
                />
                <button
                  type="button"
                  onClick={() => file1Ref.current?.click()}
                  disabled={useTestData}
                  className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    useTestData 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-red-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Choose File
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {file1 ? file1.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* File Upload 2 */}
            <div className={useTestData ? 'opacity-50' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Second Dataset
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  ref={file2Ref}
                  onChange={(e) => handleFileChange(e, 2)}
                  className="hidden"
                  disabled={useTestData}
                />
                <button
                  type="button"
                  onClick={() => file2Ref.current?.click()}
                  disabled={useTestData}
                  className={`px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                    useTestData 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-red-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  Choose File
                </button>
                <span className="ml-3 text-sm text-gray-500">
                  {file2 ? file2.name : 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Key Pair Generation (conditional) */}
            {methodInfo.requiresKeyPair && (
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Encryption Keys</h3>
                {keyPair ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                        <span className="font-semibold">Public Key:</span> {keyPair.publicKey}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                        <span className="font-semibold">Private Key:</span> {keyPair.privateKey}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Note: In a production environment, keep your private key secure and never share it.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={generateKeyPair}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Generate Key Pair
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || isGenerating || (!useTestData && (!file1 || !file2)) || (methodInfo.requiresKeyPair && !keyPair)}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  (isLoading || isGenerating || (!useTestData && (!file1 || !file2)) || (methodInfo.requiresKeyPair && !keyPair))
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {isLoading ? 'Comparing...' : isGenerating ? 'Generating...' : 'Compare Datasets'}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison Results</h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                {result}
              </pre>
            </div>
          )}
          {comparisonResult && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Comparison Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">File 1 Emails</p>
                  <p className="text-2xl font-bold">{comparisonResult.file1Count.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Common Emails</p>
                  <p className="text-2xl font-bold">{comparisonResult.commonCount.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <p className="text-sm text-gray-600">File 2 Emails</p>
                  <p className="text-2xl font-bold">{comparisonResult.file2Count.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Comparison completed in {comparisonResult.executionTime.toFixed(2)}ms
              </div>
            </div>
          )}
        </div>

        {/* Memory Usage Footer */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Server Memory Usage (MB)</h3>
          {memoryUsage ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">RSS</div>
                <div className="text-gray-600">{memoryUsage.rss.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Heap Total</div>
                <div className="text-gray-600">{memoryUsage.heapTotal.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Heap Used</div>
                <div className="text-gray-600">{memoryUsage.heapUsed.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">External</div>
                <div className="text-gray-600">{memoryUsage.external.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Array Buffers</div>
                <div className="text-gray-600">{memoryUsage.arrayBuffers.toFixed(2)}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Last Updated</div>
                <div className="text-gray-600 text-xs">
                  {memoryUsage.timestamp ? new Date(memoryUsage.timestamp).toLocaleTimeString() : 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Loading memory usage...</div>
          )}
          <div className="mt-2 text-xs text-gray-400">
            Memory usage updates every 5 seconds. RSS includes all memory used by the process.
          </div>
        </div>
      </div>
    </div>
  );
}
