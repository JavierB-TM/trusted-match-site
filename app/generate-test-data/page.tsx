// app/generate-test-data/page.tsx
'use client';

import { useState } from 'react';

interface DownloadLink {
  url: string;
  filename: string;
  size: number;
}

interface DownloadLinks {
  file1: DownloadLink | null;
  file2: DownloadLink | null;
}

export default function GenerateTestDataPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks>({
    file1: null,
    file2: null
  });
  const [error, setError] = useState<string | null>(null);
  
  const [config, setConfig] = useState({
    size1: 1000,
    size2: 1000,
    intersection: 30, // percentage
  });

  // Generate test data using server-side API
  const generateTestData = async () => {
    setIsGenerating(true);
    setError(null);
    setDownloadLinks({ file1: null, file2: null });
    
    try {
      const { size1, size2, intersection } = config;
      
      const response = await fetch('/api/generate-test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ size1, size2, intersection }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate test data');
      }

      if (data.success && data.files) {
        setDownloadLinks({
          file1: data.files.file1,
          file2: data.files.file2
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating test data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Test Data</h1>
          <p className="text-gray-600 mb-6">
            Create two CSV files with email addresses for testing purposes. 
            Configure the size of each file and the percentage of emails that should overlap between them.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File 1 Size
              </label>
              <input
                type="number"
                id="size1"
                name="size1"
                min="1"
                max="50000000"
                value={config.size1}
                onChange={(e) => setConfig({...config, size1: parseInt(e.target.value) || 0})}
                disabled={isGenerating}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File 2 Size
              </label>
              <input
                type="number"
                id="size2"
                name="size2"
                min="1"
                max="50000000"
                value={config.size2}
                onChange={(e) => setConfig({...config, size2: parseInt(e.target.value) || 0})}
                disabled={isGenerating}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intersection %
              </label>
              <input
                type="number"
                id="intersection"
                name="intersection"
                min="0"
                max="100"
                value={config.intersection}
                onChange={(e) => setConfig({...config, intersection: parseInt(e.target.value) || 0})}
                disabled={isGenerating}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                suppressHydrationWarning
              />
            </div>
          </div>

          <button
            onClick={generateTestData}
            disabled={isGenerating}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isGenerating ? 'Generating Files...' : 'Generate Test Data'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {(downloadLinks.file1 || downloadLinks.file2) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Download Generated Files</h2>
            <div className="space-y-4">
              {downloadLinks.file1 && (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-green-900">Test Set 1</h3>
                    <p className="text-sm text-green-700">
                      {downloadLinks.file1.size.toLocaleString()} emails
                    </p>
                    <p className="text-xs text-green-600">{downloadLinks.file1.filename}</p>
                  </div>
                  <a
                    href={downloadLinks.file1.url}
                    download={downloadLinks.file1.filename}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              )}
              
              {downloadLinks.file2 && (
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-blue-900">Test Set 2</h3>
                    <p className="text-sm text-blue-700">
                      {downloadLinks.file2.size.toLocaleString()} emails
                    </p>
                    <p className="text-xs text-blue-600">{downloadLinks.file2.filename}</p>
                  </div>
                  <a
                    href={downloadLinks.file2.url}
                    download={downloadLinks.file2.filename}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
