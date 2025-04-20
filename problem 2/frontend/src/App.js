import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedOption, setSelectedOption] = useState('p');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMock, setUseMock] = useState(false);

  const numberOptions = [
    { id: 'p', name: 'Prime Numbers' },
    { id: 'f', name: 'Fibonacci Numbers' },
    { id: 'e', name: 'Even Numbers' },
    { id: 'r', name: 'Random Numbers' },
  ];

  const fetchNumbers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `http://localhost:8000/numbers/${selectedOption}${useMock ? '?use_mock=true' : ''}`;
      const response = await axios.get(url);
      setResult(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.detail : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
      </header>
      
      <main className="App-main">
        <div className="control-panel">
          <div className="selector">
            <label htmlFor="numberType">Select Number Type:</label>
            <select 
              id="numberType" 
              value={selectedOption} 
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              {numberOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mock-data-toggle">
            <label>
              <input
                type="checkbox"
                checked={useMock}
                onChange={() => setUseMock(!useMock)}
              />
              Use Mock Data
            </label>
          </div>
          
          <button 
            onClick={fetchNumbers} 
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Numbers'}
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        {result && (
          <div className="results">
            <div className="result-card">
              <h3>Previous Window State</h3>
              <div className="number-list">
                {result.windowPrevState.length > 0 ? 
                  result.windowPrevState.map((num, i) => <span key={i}>{num}</span>) : 
                  <span className="empty-message">Empty</span>
                }
              </div>
            </div>
            
            <div className="result-card">
              <h3>Current Window State</h3>
              <div className="number-list">
                {result.windowCurrState.length > 0 ? 
                  result.windowCurrState.map((num, i) => <span key={i}>{num}</span>) : 
                  <span className="empty-message">Empty</span>
                }
              </div>
            </div>
            
            <div className="result-card">
              <h3>New Numbers Added</h3>
              <div className="number-list">
                {result.numbers.length > 0 ? 
                  result.numbers.map((num, i) => <span key={i}>{num}</span>) : 
                  <span className="empty-message">None</span>
                }
              </div>
            </div>
            
            <div className="result-card average">
              <h3>Average</h3>
              <div className="average-value">{result.avg}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
