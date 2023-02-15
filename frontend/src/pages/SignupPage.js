import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

  const SignupPage = () => {
  const { signUpUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="signup-wrapper">
        <form onSubmit={signUpUser}>
          <input type="username" name="username" placeholder="Enter Username" />
          <input type="email" name="email" placeholder="Enter Email" />
          <input type="password1 " name="password" placeholder="Enter Password" />
          <input type="password" name="password" placeholder="Enter Password" />
          <input type="submit" value="Submit" />
          <h5>Already have an account? Log in <Link to='/login'>here</Link></h5>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
