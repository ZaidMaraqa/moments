import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import '../css/explore.css'

const ExplorePage = () => {

    let {authTokens} = useContext(AuthContext);
    let [posts, setPosts] = useState([]);


    let getRecommendedPosts = async () => {
        try{
            let response = await fetch('http://localhost:8000/api/recommended_posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if(response.status === 200){
                setPosts(data)
            } else {
                throw new Error(response.statusText)
            }
        }
        catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        getRecommendedPosts();
    }, []);

    

    return(
        <div className='explorePage'>
            <div className='content-container'>
                <ul>
                    {posts.map((post) => (
                      <li key={post.id}>
                        {/* Profile picture and username */}
                      <div className="profile-header">
                        <div className="profile-info">
                          <img
                            className="profile-picture"
                            src={`http://localhost:8000${post.user.profile_picture || '/desktop/default_user.jpg'}`}
                            alt={`${post.user.username}'s Profile Picture`}
                          />
                          <span className="username">{post.user.username}</span>
                        </div>
                      </div>
                      <div className='post-conten'>
                        <img src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post}  />
                      </div>
                      <div className='caption'>
                        <span><b>{post.user.username}</b> </span><span>{post.text ? post.text : 'No caption available'}</span>
                      </div>
                        </li>
                      ))}
                  </ul>
            </div>
        </div>
    )
}

export default ExplorePage;