import './App.css';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import AuthContext, { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage';
import React, { useContext } from 'react';
import PostUpload from './pages/PostUploadPage';
import UserProfilePage from './pages/UserProfile';
import CodeOfConduct from './pages/conductpage'
import SearchPage from './pages/Search';
import { Sidebar } from './pages/Sidebar';
import EditProfilePage from './pages/EditProfilePage';
import ExplorePage from './pages/ExplorePage';
import UploadStory from './pages/UploadStory';
// import '../src/css/sidebar.css'; 

function App() {

  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <div className='sidebar-container'>
          <DisplaySideBar />
            </div>
            <Routes>
              <Route element={<PrivateRoutes />}>
                  <Route path="/" element={<HomePage/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/code" element={<CodeOfConduct/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/postupload" element={<PostUpload/>} />
              </Route>
              <Route element={<PrivateRoutes />}>
                  <Route path="/storyupload" element={<UploadStory/>} />
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
