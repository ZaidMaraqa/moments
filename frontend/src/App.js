import './App.css';
import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import AuthContext, { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage';
import PostUpload from './pages/PostUploadPage';
import UserProfilePage from './pages/UserProfile';
import SearchPage from './pages/Search';
import { Sidebar } from './pages/Sidebar';
import EditProfilePage from './pages/EditProfilePage';
import { Accordion } from './pages/conduct';
import ExplorePage from './pages/ExplorePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const[isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Example condition: Hide loader after data is fetched or after a timeout
    setTimeout(() => {
      setIsLoading(false);
    }, 700); // Assuming it takes 3 seconds to load your data

    // Alternatively, you might set this based on actual data fetching logic
  }, []);

  useEffect(() => {
    // This effect runs when isLoading changes.
    const loader = document.getElementById('loader');
    if (loader) {
      if (isLoading) {
        loader.style.display = 'grid'; // Show loader
      } else {
        loader.style.display = 'none'; // Hide loader
      }
    }
  }, [isLoading]);

  return (
    <div className="App">
      <Router>
        <ToastContainer />
        <AuthProvider>
          <div className='sidebar-container'>
          <DisplaySideBar />
            </div>
            <Routes>
              <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<HomePage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/sidebar" element={<Sidebar/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/postupload" element={<PostUpload/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/userprofile/:userId" element={<UserProfilePage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/search" element={<SearchPage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/explore" element={<ExplorePage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/conduct" element={<Accordion/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/editprofile/:userId" element={<EditProfilePage/>} />
              </Route>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignUpPage/>}/>
            </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
};


function DisplaySideBar() {
  const { authTokens } = useContext(AuthContext);
  return authTokens ? <Sidebar /> : null;
}

export default App;
