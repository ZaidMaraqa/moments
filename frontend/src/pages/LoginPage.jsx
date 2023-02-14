import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/login.css';
import { Link } from 'react-router-dom'

const LoginPage = () => {
const { loginUser } = useContext(AuthContext);

  return (
    <div className="login-container">
      <h2>Log In</h2>
      <div className="login-wrapper">
        <form onSubmit={loginUser}>
          <input type="text" name="username" placeholder="Enter Username" />
          <input type="password" name="password" placeholder="Enter Password" />
          <input type="submit" value="Submit" />
          <h5>Don't have an account? Sign up <Link to='/signup'>here</Link></h5>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;


