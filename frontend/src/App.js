import './App.css';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
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
            <Switch>
              <PrivateRoute path="/" element={<HomePage/>} exact/>
              <Route path="/login" element={<LoginPage/>}/>
            </Switch>
          </Routes>
      </Router>
    </div>
  );
};

// const appDiv = document.getElementById('app');
// render(<App />, appDiv)

export default App;
