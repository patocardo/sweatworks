import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [greeting, setGreeting] = useState('Before');

  useEffect(() => {
    fetch('/api/greet')
      .then(response => response.json())
      .then(data => setGreeting(data.message))
      .catch(error => console.error('Error fetching greeting:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{greeting}</h1>
      </header>
    </div>
  );
}

export default App;
