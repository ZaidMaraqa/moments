import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FollowButton from '../components/FollowButton';
import BlockButton from '../components/BlockButton';
import '../css/userprofile.css';
import FollowRequests from './Requests'; 
import DeleteButton from '../components/DeleteButton';
import { config } from '../utils/env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';



const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // state variable to track if the current user is following the user whose profile is being displayed
  let { authTokens, user:currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/user/${userId}/profile/`, {
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
  

  const getUserPosts = async () => {
    try{
      const response = await fetch(`${config.apiUrl}/posts/user/${userId}/`,{
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
              src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${user.profile_picture || 'media/images/default_user.png'}`}
              alt={`${user.username}'s Profile`}
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
                <p><b>Followers</b> {user.followers_count} </p>
                <p><b>Following</b> {user.following_count}</p>
                <p><b>Moments</b> {posts.length}</p>
              </div>
            </div>
          </div>
          <hr className="profile-divider1" />
          <div className="posts-grid1">
            {currentUser.id !== parseInt(userId) && user.is_private && !isFollowing ? (
              <div className='private-display'>
                <FontAwesomeIcon className='harvey' icon={faLock} />
                <p>This profile is private.</p>    
              </div>
            ) : (
              posts.map((post) => (
                <li key={post.id} className='post-item1'>
                  <div className='post-image-container1'>
                    <img className='post-image1'
                      src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${post.image ? post.image : '/media/images/background.jpeg'}`}
                      alt={post.post}
                      style={{ maxWidth: '400px', maxHeight: '400px' }}
                    />
                  </div>
                <div className='delete'>
                  {authTokens && currentUser.id === parseInt(userId) && (
                    <DeleteButton postId={post.id} authTokens={authTokens}  />
                  )}
                  </div>
                </li>
              ))
            )}
          </div>
          {user && authTokens && currentUser.id === parseInt(userId) && (
          <div>
            <FollowRequests userId={userId} />
          </div>
      )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
  
  
};

export default UserProfilePage;
