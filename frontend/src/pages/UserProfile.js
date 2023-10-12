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
        console.log("setting user data to:", data);
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
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      
      if(response.status === 200){
        getUserPosts()
      }
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
    <div className="user-profile-container1">
      {user ? (
        <div>
          <div className="profile-header1">
            <img
              className="profile-picture1"
              src={`http://localhost:8000${user.profile_picture || 'media/images/default_user.png'}`}
              alt={`${user.username}'s Profile Picture`}
            />
            <div className="profile-info1">
              <div className='username-actions1'>
                <h3 className="profile-username1">{user.username}</h3>
                {authTokens && currentUser.id === parseInt(userId) && (
                  <button className= 'edit-button' onClick={() => navigate(`/editprofile/${userId}`)}>Edit</button>
                )}
                {authTokens && currentUser.id !== parseInt(userId) && (
                  <div className="profile-actions1">
                    <FollowButton userId={user.id} isFollowing={isFollowing} setFollowing={setIsFollowing} />
                    <BlockButton userId={user.id} />
                  </div>
                )}
              </div>
              <p>{user.bio}</p>
              <div className="profile-stats1">
                <p>{user.followers_count} <b>Followers</b></p>
                <p>{user.following_count} <b>Following</b></p>
              </div>
            </div>
          </div>
          <hr className="profile-divider1" />
          <div className="posts-grid1">
            {user.is_private && !isFollowing ? (
              <div>
                <p>This profile is private.</p>
                <p>Follow the user to see their posts.</p>
              </div>
            ) : (
              posts.map((post) => (
                <li key={post.id} className='post-item1'>
                  <div className='post-image-container1'>
                    <img className='post-image1'
                      src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`}
                      alt={post.post}
                      style={{ maxWidth: '400px', maxHeight: '400px' }}
                    />
                  </div>
                  {authTokens && currentUser.id === parseInt(userId) && (
                    <button
                      className="fas fa-trash"
                      style={{ cursor: 'pointer' }}
                      onClick={() => deletePost(post.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </li>
              ))
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
  
};

export default UserProfilePage;
