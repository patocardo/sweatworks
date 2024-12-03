import React, { useEffect, useState } from 'react';
import './App.css';
import ImageGallery from './gallery/ImageGallery';

const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [greeting, setGreeting] = useState('Before');
  console.log({apiUrl})

  useEffect(() => {
    fetch(`${apiUrl}/api/greet`)
      .then(response => response.json())
      .then(data => setGreeting(data.message))
      .catch(error => console.error('Error fetching greeting:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{greeting}</h1>
      </header>
      <ImageGallery />
    </div>
  );
}

export default App;
