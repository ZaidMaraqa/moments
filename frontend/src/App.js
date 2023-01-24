import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import React from 'react';
import Header from './components/Header'

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header/>
            <Routes>
              <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<HomePage/>} exact/>
              </Route>
              <Route path="/login" element={<LoginPage/>}/>
            </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};

// const appDiv = document.getElementById('app');
// render(<App />, appDiv)

export default App;
