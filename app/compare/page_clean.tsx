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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      setError('An error occurred during comparison');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Compare Datasets</h1>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
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
          {/* Method Selection */}
          <div className="mb-4">
            <h2 className="text-base md:text-lg font-medium text-gray-900 mb-2">Comparison Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {Object.entries(METHODS).map(([key, method]) => (
                <div
                  key={key}
                  onClick={() => setSelectedMethod(key as ComparisonMethod)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                    selectedMethod === key
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 mr-2 flex-shrink-0 ${
                        selectedMethod === key
                          ? 'border-red-500 bg-red-500'
                          : 'border-gray-400'
                      }`}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{method.name}</h3>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Dataset
              </label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile1(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Dataset
              </label>
              <input
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
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-medium text-green-900 mb-2">Results</h3>
            <p className="text-sm text-green-700">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
