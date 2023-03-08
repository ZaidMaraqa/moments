import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
    let{user, logoutUser} = useContext(AuthContext)
    return (
        <div>
            {/* <Link to='/signup'>Signup</Link> */}
            {/* <span> | </span> */}
            {user ? (
                <button><p onClick={logoutUser}>Logout</p></button>
            ):(
                <Link to='/login'>Login</Link>
            )}
            <Link to='/postupload'>
            <button>Create Post</button>
          </Link>
            {/* {user && <p>Hello {user.username}</p>} */}
        </div>
    )
}

export default Header
