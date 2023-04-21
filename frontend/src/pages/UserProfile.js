import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FollowButton from './Follow';
import BlockButton from '../components/BlockButton';
import '../css/userprofile.css';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // state variable to track if the current user is following the user whose profile is being displayed
  let { authTokens, user:currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/user/${userId}/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setUser(data);
        setIsFollowing(data.is_following);

      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error deleting the post');
      }
  
      const data = await response.json();
      console.log(data.message); // Post successfully deleted.
      // Perform any necessary updates to your component state or UI here.
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const getUserPosts = async () => {
    try{
      const response = await fetch(`http://localhost:8000/api/posts/user/${userId}/`,{
        method: 'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });

      const data = await response.json();
      if(response.status === 200){
        setPosts(data);
      } else{
        throw new Error(response.statusText)
      }
    } catch(error){
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
    getUserPosts();
  }, []);

  return (
    <div className="user-profile-container">
      {user ? (
        <div>
          <div className="profile-header">
            <img
              className="profile-picture"
              src={`http://localhost:8000${user.profile_picture || '/media/images/default.png'}`}
              alt={`${user.username}'s Profile Picture`}
            />
            <h3>{user.username}</h3>
          </div>
          <p>Name: {user.first_name} {user.last_name}</p>
          <p>Bio: {user.bio}</p>
          <p>Followers: {user.followers_count}</p>
          <p>Following: {user.following_count}</p>
          {authTokens && currentUser.id === parseInt(userId) && (
            <button onClick={() => navigate(`/editprofile/${userId}`)}>Edit Profile</button>
          )}
          {authTokens && currentUser.id !== parseInt(userId) && (
            <>
              <FollowButton userId={user.id} isFollowing={isFollowing} setFollowing={setIsFollowing} />
              <span> ||</span>
              <BlockButton userId={user.id} />
            </>
          )}
          <h3>{user.username}'s Posts</h3>
          <div className='posts-grid'>
              {posts.map((post) => (
                <li key={post.id}>
                  <h4>{post.text}</h4>
                  <img
                    src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`}
                    alt={post.post}
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  {authTokens && currentUser.id === parseInt(userId) && (
                    <i
                      className="fas fa-trash"
                      style={{ cursor: 'pointer' }}
                      onClick={() => deletePost(post.id)}
                    ></i>
                    )}
                </li>
              ))}
              </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
};

export default UserProfilePage;