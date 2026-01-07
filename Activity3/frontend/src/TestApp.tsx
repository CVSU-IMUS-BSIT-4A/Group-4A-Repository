

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>📚 Bookshelf Manager - Test Page</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2>Backend Status Check</h2>
        <p>Backend should be running on: http://localhost:3001</p>
        <p>API Documentation: http://localhost:3001/api</p>
      </div>
      <div style={{ 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '5px',
        margin: '20px 0'
      }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Check if backend is running on port 3001</li>
          <li>Open browser console (F12) to see any errors</li>
          <li>Try accessing the API directly: http://localhost:3001/authors</li>
        </ol>
      </div>
    </div>
  );
}

export default TestApp;
