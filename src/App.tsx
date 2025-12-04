import React from 'react';
import './App.css';
import Search from './components/Search/Search';

function App() {
  return (
    <div className='container'>
      <header className='header' data-testid='header'>
        MovieSeek
      </header>
      <div className='main'>
        <Search />
      </div>
    </div>
  );
}

export default App;
