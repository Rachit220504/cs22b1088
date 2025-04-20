import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Make sure DOM is fully loaded before trying to access 'root'
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error('Failed to render React application:', error);
      // Display a fallback error message in the DOM
      document.body.innerHTML = `
        <div style="color: red; text-align: center; margin-top: 50px;">
          <h1>Something went wrong</h1>
          <p>${error.message}</p>
        </div>
      `;
    }
  } else {
    console.error("Couldn't find root element to mount React application");
    document.body.innerHTML = `
      <div style="color: red; text-align: center; margin-top: 50px;">
        <h1>Initialization Error</h1>
        <p>Couldn't find the root element to mount the application.</p>
      </div>
    `;
  }
});
