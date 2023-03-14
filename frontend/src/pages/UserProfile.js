import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FollowButton from './Follow';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // state variable to track if the current user is following the user whose profile is being displayed
  let { authTokens } = useContext(AuthContext);

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
        setIsFollowing(data.is_following); // set isFollowing state variable to the value of the 'is_following' property of the user data
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleFollowingChange = (newFollowingValue) => {
    setIsFollowing(newFollowingValue);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>{user.username}'s Profile</h2>
          <p>Name: {user.first_name} {user.last_name}</p>
          <p>Email: {user.email}</p>
          <p>Bio: {user.bio}</p>
          <FollowButton userId={user.id} following={isFollowing} setFollowing={handleFollowingChange} />
                </div>
                ) : (
            <p>Loading...</p>
            )}
        </div>
);
};

export default UserProfilePage;