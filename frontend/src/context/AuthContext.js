import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom';

let AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    let loginUser = async (e )=> {
        e.preventDefault();
        let response = await fetch('http://localhost:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()

        if(response.status === 200){
          setAuthTokens(data)
          setUser(jwt_decode(data.access))
          localStorage.setItem('authTokens', JSON.stringify(data))
          navigate('/')
        }else{
            alert('Something went wrong here :(')
        }
    }
 
    let signUpUser = async (e ) => {
      e.preventDefault();
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password1, setPassword1] = useState('');
      const [password2, setPassword2] = useState('');
      const response = await fetch('http://localhost:8000/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password1: password1,
          password2: password2,
        }),
      })
      let data = await response.json();
      if (response.status === 201) {
        setAuthTokens(data);
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/')
      } 
      else {
        alert('Something went wrong :(');
      }
    };

    



    let logoutUser= () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigate('/login')
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        setAuthTokens:setAuthTokens,
        setUser:setUser,
        loginUser:loginUser,
        signUpUser:signUpUser,
        logoutUser:logoutUser
    }

    let updateToken = async ()=> {
        console.log('Update token called')
        let response = await fetch('http://localhost:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                'refresh': authTokens ? authTokens.refresh : ''
              })
        })
        let data = await response.json()

        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }

    useEffect(() =>{

        if(loading){
            updateToken()
        }
        
        let fourMinutes = 1000 * 60 * 4
        let interval = setInterval(()=>{
            if(authTokens){
                updateToken()
            }
        }, fourMinutes)
        return ()=> clearInterval(interval)


    }, [authTokens, loading])


    return(
        <AuthContext.Provider value ={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
