// app/compare/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

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
    description: 'Allows for approximate matching with similarity scoring',
    requiresKeyPair: false,
  },
  encrypted: {
    name: 'Encrypted Match',
    description: 'Compares encrypted data without revealing original values',
    requiresKeyPair: true,
  },
  hashed: {
    name: 'Hashed Match',
    description: 'Compares hashed values for privacy-preserving matching',
    requiresKeyPair: false,
  },
  sha256: {
    name: 'SHA-256 Match',
    description: 'Uses SHA-256 hashing for secure comparison',
    requiresKeyPair: false,
  },
};

export default function ComparePage() {
  const [selectedMethod, setSelectedMethod] = useState<ComparisonMethod>('exact');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  
  // Test data generation state
  const [showTestDataConfig, setShowTestDataConfig] = useState(false);
  const [testDataConfig, setTestDataConfig] = useState({
    file1Size: 1000,
    file2Size: 1000,
    intersectionPercent: 20
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShowTestDataConfig = () => {
    setShowTestDataConfig(true);
  };

  const handleGenerateTestData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Call the API to generate test data
      const response = await fetch('/api/generate-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          size1: testDataConfig.file1Size,
          size2: testDataConfig.file2Size,
          intersectionPercent: testDataConfig.intersectionPercent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test data');
      }

      const data = await response.json();
      setResult(`Test data generated successfully! Files: ${data.file1Path} and ${data.file2Path}`);
      setShowTestDataConfig(false);
    } catch (error) {
      console.error('Failed to generate test data:', error);
      setError('Failed to generate test data');
    } finally {
      setIsLoading(false);
    }
  }, [testDataConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file1 || !file2) {
      setError('Please select both files');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Simulate comparison logic
      setResult('Comparison completed successfully!');
    } catch (error) {
      console.error('Comparison error:', error);
      setError('An error occurred during comparison');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="bg-gray-50 py-4 md:py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
                Dataset Comparison
              </h1>
              <p className="text-gray-600 mb-4 text-center text-sm md:text-base">
                Loading...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-4 md:py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 text-center">
              Dataset Comparison
            </h1>
            <p className="text-gray-600 mb-4 text-center text-sm md:text-base">
              Upload two CSV files to compare using various matching methods
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Generate Test Data Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleShowTestDataConfig}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Generate Test Data
              </button>
            </div>

            {/* Method Selection */}
            <div className="mb-3 md:mb-4">
              <label htmlFor="method-select" className="block text-base md:text-lg font-medium text-gray-900 mb-2">
                Comparison Method
              </label>
              <select
                id="method-select"
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as ComparisonMethod)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
              >
                {Object.entries(METHODS).map(([key, method]) => (
                  <option key={key} value={key}>
                    {method.name}
                  </option>
                ))}
              </select>
              
              {/* Selected Method Info */}
              <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{METHODS[selectedMethod].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{METHODS[selectedMethod].description}</p>
                    {METHODS[selectedMethod].requiresKeyPair && (
                      <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Requires Key Pair
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="file1" className="block text-sm font-medium text-gray-700 mb-2">
                  First Dataset
                </label>
                <input
                  id="file1"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile1(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
              <div>
                <label htmlFor="file2" className="block text-sm font-medium text-gray-700 mb-2">
                  Second Dataset
                </label>
                <input
                  id="file2"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setFile2(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !file1 || !file2}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                  (isLoading || !file1 || !file2)
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-white'
                }`}
              >
                {isLoading ? 'Comparing...' : 'Compare Datasets'}
              </button>
            </div>
          </form>

          {/* Results */}
          {result && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-base md:text-lg font-medium text-green-900 mb-2">Results</h3>
              <p className="text-sm text-green-700">{result}</p>
            </div>
          )}
        </div>
      </div>

      {/* Test Data Configuration Modal */}
      {showTestDataConfig && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configure Test Data</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="file1-size" className="block text-sm font-medium text-gray-700 mb-1">
                    File 1 Size (number of emails)
                  </label>
                  <input
                    id="file1-size"
                    type="number"
                    min="1"
                    max="10000000"
                    value={testDataConfig.file1Size}
                    onChange={(e) => setTestDataConfig({...testDataConfig, file1Size: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="file2-size" className="block text-sm font-medium text-gray-700 mb-1">
                    File 2 Size (number of emails)
                  </label>
                  <input
                    id="file2-size"
                    type="number"
                    min="1"
                    max="10000000"
                    value={testDataConfig.file2Size}
                    onChange={(e) => setTestDataConfig({...testDataConfig, file2Size: parseInt(e.target.value) || 1})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="intersection-percent" className="block text-sm font-medium text-gray-700 mb-1">
                    Intersection % (of File 1)
                  </label>
                  <input
                    id="intersection-percent"
                    type="number"
                    min="0"
                    max="100"
                    value={testDataConfig.intersectionPercent}
                    onChange={(e) => setTestDataConfig({...testDataConfig, intersectionPercent: parseInt(e.target.value) || 0})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of File 1 emails that will also appear in File 2
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowTestDataConfig(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateTestData}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isLoading ? 'Generating...' : 'Generate Files'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
