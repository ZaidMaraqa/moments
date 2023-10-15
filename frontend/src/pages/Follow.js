import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  
        let responseData = await response.json();
  
        if (response.status === 200) {
          if (responseData.status === "follow request sent") {
            toast.info('Follow request sent');
          } else if (responseData.status === "followed") {
            toast.success('User followed');
            setFollowing(true);
          }
        } else if (response.status === 400 && responseData.status === "error") {
          toast.error(responseData.message);
        } else {
          toast.error('User could not be followed');
          throw new Error(response.statusText);
        }
      } catch (error) {
        toast.error('Something went wrong. Please make sure you are connected to the internet.');
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
          toast.success('User unfollowed')
          setFollowing(false);
        } else {
          toast.error('User could not be unfollowed')
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
