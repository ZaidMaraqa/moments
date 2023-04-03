import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/login.css';
import { Link } from 'react-router-dom'

const LoginPage = () => {
const { loginUser } = useContext(AuthContext);

  return (
    <div className="login">
      <div className="avatar">
        <img src={`http://localhost:8000${'/media/images/logo.jpeg' || '/media/images/default.png'}`} alt="logo" />
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
        <span>Don't have an account? Sign up </span><Link to="/signup">here</Link>
      </form>
    </div>
  );
};

export default LoginPage;


