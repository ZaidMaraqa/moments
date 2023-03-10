import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage';
import React from 'react';
import Header from './components/Header'
import PostUpload from './pages/PostUploadPage';
import UserProfilePage from './pages/UserProfile';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header/>
            <Routes>
              <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<HomePage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/postupload" element={<PostUpload/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/userprofile/:userId" element={<UserProfilePage/>} />
              </Route>
              {/* <Route path="/" element={<HomePage/>} exact/> */}
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignUpPage/>}/>
            </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};


export default App;
