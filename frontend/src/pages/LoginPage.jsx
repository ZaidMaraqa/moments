import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/login.css';
import { Link } from 'react-router-dom'
import useBodyClass from '../utils/BodyClass';

const LoginPage = () => {
const { loginUser } = useContext(AuthContext);

useBodyClass('login-background')



  return (
    <div className='login-container'>
      <div className='login-background'>
        <div className="login">
          <div className="avatar">
            <img src="/logo.jpeg" alt="Logo" className="logo" />
          </div>
          <h2>Login</h2>
          <h3>Welcome back </h3>
          <form className="login-form" onSubmit={loginUser}>
            <div className="textbox">
              <input type="email" name="username" placeholder="Username" />
              <span className="material-symbols-outlined">account_circle</span>
            </div>
            <div className="textbox">
              <input type="password" name="password" placeholder="Password" />
              <span className="material-symbols-outlined">lock</span>
            </div>
            <button type="submit">LOGIN</button>
            <span>Don't have an account? Sign up <Link to="/signup">here</Link></span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


