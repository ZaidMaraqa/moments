import { Outlet, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import React from 'react'


const PrivateRoutes = () => {
    let auth = useContext(AuthContext)
    return(
        !auth.authTokens ? <Navigate to="/login"/> : <Outlet/>
    )
}

export default PrivateRoutes;
