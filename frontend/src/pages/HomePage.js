import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
// import '../css/home.css'

const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);
    

    
    let getPosts = async () => {
        try {
            let response = await fetch('http://localhost:8000/api/posts/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if (response.status === 200) {
                setPosts(data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            logoutUser();
        }
    };

    useEffect(() => {
        getPosts();
    }, []);


    

    return (
        <div className='homePage'>
            <ul>
            {posts.map((post) => (
                <li key={post.id}>
                    <img src={post.image_url} alt={post.post} />
                    <p>{post.caption}</p>
                </li>
                ))}
            </ul>
            <Link to='/feed'>
                <button>Create Post</button>
            </Link>
        </div>
    );
};


export default HomePage
