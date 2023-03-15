import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";
import '../css/signUp.css'; 

  const SignupPage = () => {
  // const { signUpUser } = useContext(AuthContext);
  // const [username, setUsername] = useState('');
  // const [email, setEmail] = useState('');
  // const [password1, setPassword1] = useState('');
  // const [password2, setPassword2] = useState('');
  const navigate = useNavigate();
  // let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  // let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)

  let signUpUser = async (e ) => {
    try {
      e.preventDefault();
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'username': e.target.username.value,
            'first_name': e.target.first_name.value,
            'last_name': e.target.last_name.value,
            'email': e.target.email.value,
            'password1': e.target.password1.value,
            'password2': e.target.password2.value,
        })
      });
      
      console.log(response.statusText);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      let data = await response.json();
      console.log(data);
  
      if (response.status === 201) {
        const message = data.message;
        if (message) {
          console.log(message);
          navigate('/login');
        } else {
          alert('Something went wrong :(');
        }
      } else {
        alert('Something went wrong :(');
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <div className="signup-wrapper">
        <form onSubmit={signUpUser}>
          <input type="username" name="username" placeholder="Enter Username" />
          <input type="text" name="first_name" placeholder="Enter first name" />
          <input type="text" name="last_name" placeholder="Enter last name" />
          <input type="text" name="email" placeholder="Enter email" />
          <input type="password" name="password1" placeholder="Enter Password" />
          <input type="password" name="password2" placeholder="Enter Password Confirmation" />
          <input type="submit" value="Submit" />
          <h5>Already have an account? Log in <Link to='/login'>here</Link></h5>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
