import React, { useState, useEffect, useCallback } from 'react';

const TestConnectionPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [corsTestResult, setCorsTestResult] = useState<any>(null);
  const [corsTestError, setCorsTestError] = useState<string>('');
  const [corsTestLoading, setCorsTestLoading] = useState<boolean>(false);
  
  // Always use the Render backend directly
  const baseUrl = 'https://habit-hub-backend.onrender.com';
  
  const testConnection = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Connecting to:', `${baseUrl}/test-connection-data`);
      
      const response = await fetch(`${baseUrl}/test-connection-data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Received response:', responseData);
      setData(responseData);
      setLoading(false);
    } catch (err: any) {
      console.error('Connection test failed:', err);
      setError(`Failed to connect to the backend: ${err.message}. See console for details.`);
      setLoading(false);
    }
  }, [baseUrl]);
  
  const testCors = useCallback(async () => {
    setCorsTestLoading(true);
    setCorsTestError('');
    setCorsTestResult(null);
    
    try {
      console.log('Testing CORS at:', `${baseUrl}/cors-test`);
      
      const response = await fetch(`${baseUrl}/cors-test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('CORS test response:', responseData);
      setCorsTestResult(responseData);
      setCorsTestLoading(false);
    } catch (err: any) {
      console.error('CORS test failed:', err);
      setCorsTestError(`CORS test failed: ${err.message}`);
      setCorsTestLoading(false);
    }
  }, [baseUrl]);
  
  useEffect(() => {
    testConnection();
  }, [testConnection]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Backend Connection Test</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Connection Settings</h2>
        <p><strong>Page Origin:</strong> {window.location.origin}</p>
        <p><strong>Backend URL:</strong> {baseUrl}</p>
        <p><strong>Test Endpoint:</strong> {baseUrl}/test-connection-data</p>
      </div>
      
      {loading && (
        <div className="text-center p-4">
          <p className="text-gray-600">Testing connection to backend...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && data && (
        <div className="space-y-6">
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">Root Endpoint Test</h2>
            <p><strong>Status:</strong> Success ✅</p>
            <p><strong>Message:</strong> {data.root.message}</p>
          </div>
          
          {data.health && (
            <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
              <h2 className="text-xl font-semibold mb-2">Health Endpoint Test</h2>
              <p><strong>Status:</strong> {data.health.status}</p>
              <p><strong>Environment:</strong> {data.health.environment}</p>
              <pre className="mt-2 bg-green-50 p-2 rounded">
                {JSON.stringify(data.health, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">CORS Test</h2>
        <button 
          onClick={testCors}
          disabled={corsTestLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {corsTestLoading ? 'Testing...' : 'Test CORS'}
        </button>
        
        {corsTestError && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            <p className="font-bold">Error</p>
            <p>{corsTestError}</p>
          </div>
        )}
        
        {!corsTestLoading && !corsTestError && corsTestResult && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            <p><strong>Status:</strong> Success ✅</p>
            <p><strong>Message:</strong> {corsTestResult.message}</p>
            <p><strong>Origin:</strong> {corsTestResult.requestHeaders.origin}</p>
            <p><strong>Referer:</strong> {corsTestResult.requestHeaders.referer}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnectionPage; 