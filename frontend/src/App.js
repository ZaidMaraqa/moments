import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import React from 'react';
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
          <Routes>
            <Route path="/" element={<HomePage/>} exact/>
            <Route path="/login" element={<LoginPage/>}/>
          </Routes>
      </Router>
    </div>
  );
};

// const appDiv = document.getElementById('app');
// render(<App />, appDiv)

export default App;
