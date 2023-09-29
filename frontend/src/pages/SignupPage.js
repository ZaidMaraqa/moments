import React from 'react';
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import '../css/signUp.css'; 
import useBodyClass from '../utils/BodyClass';

  const SignupPage = () => {


  const navigate = useNavigate();
  useBodyClass('signup-bg')

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
            'bio': e.target.bio.value,
            'password1': e.target.password1.value,
            'password2': e.target.password2.value,
        })
      });
      
      console.log(response.statusText);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      let data = await response.json();
  
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
    <>
      <div className="signup-bg">
        <div className="clouds"></div>
        <div className="signup-container">
          <h2>Sign Up</h2>
          <div className="signup-wrapper">
            <form className="form" onSubmit={signUpUser}>
              <div className="textbox">
                <input type="text" name="username" required />
                <label>Username</label>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="textbox">
                <input type="text" name="first_name" required />
                <label>First Name</label>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="textbox">
                <input type="text" name="last_name" required />
                <label>Last Name</label>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="textbox">
                <input type="text" name="email" required />
                <label>Email</label>
                <span className="material-symbols-outlined">email</span>
              </div>
              <div className="textbox">
                <input type="text" name="bio" required />
                <label>Bio</label>
                <span className="material-symbols-outlined">account_circle</span>
              </div>
              <div className="textbox">
                <input type="password" name="password1" required />
                <label>Password</label>
                <span className="material-symbols-outlined">key</span>
              </div>
              <div className="textbox">
                <input type="password" name="password2" required />
                <label>Password Confirmation</label>
                <span className="material-symbols-outlined">key</span>
              </div>
              <button type="submit">
                Join Moments
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p>
                Already have an account? Log in <Link to="/login">here</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );  
};

export default SignupPage;
