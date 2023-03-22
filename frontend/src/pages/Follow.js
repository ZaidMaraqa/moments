import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const FollowButton = ({ userId, isFollowing, setFollowing }) => {
  let { authTokens, user } = useContext(AuthContext);

  if( user && user.id === parseInt(userId)){
    return null;
  }

  let handleFollow = async () => {
    if (authTokens && userId) {
      try {
        let response = await fetch(`http://localhost:8000/api/users/${userId}/follow/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });

        if (response.status === 200) {
          setFollowing(true);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  let handleUnFollow = async () => {
    if (authTokens && userId) {
      try {
        let response = await fetch(`http://localhost:8000/api/users/${userId}/unfollow/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });

        if (response.status === 200) {
          setFollowing(false);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <button onClick={isFollowing ? handleUnFollow : handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
