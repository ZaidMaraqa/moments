import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom'
import '../css/recommendations.css';
import { config } from '../utils/env'

const UserRecommendations = () => {
    let { authTokens, user:currentUser } = useContext(AuthContext);
    let [recommendedUsers, setRecommendedUsers] = useState([]);




    const getRecommendations = async () => {
        try{
            let response = await fetch(`${config.apiUrl}/users/${currentUser.id}/recommendations/`,{
              method: 'GET',
              headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`,
              },
            });
            
            const data = await response.json();
            if(response.status === 200){
              setRecommendedUsers(data);
            } else{
              throw new Error(response.statusText)
            }
          } catch(error){
            console.log(error);
          }
    };

    useEffect(() => {
        getRecommendations();
    }, [authTokens])


    return (
      <div className='recommendations-wrapper'>
        <ul className='current-user'>
          <li>
          <img
              className="profile-picture"
              src={`http://localhost:8000/media/${currentUser.profile_picture}`}
              alt={`${currentUser.username}'s Profile`}
            />
              <div className='darko'>
              <Link to={`/userprofile/${currentUser.id}`}>
                <button className="suggested-user-button">{currentUser.username}</button>
              </Link>
              </div>
          </li>
        </ul>

        <h4>Suggested Users</h4>
        <ul>
          {recommendedUsers.map((user) => (
            <li key={user.id}>
              <img
                    className="profile-picture"
                    src={`http://localhost:8000${user.profile_picture || '/Desktop/default_user.jpg'}`}
                    alt={`${user.username}'s Profile`}
                  />
              <div className='darko'>
              <Link to={`/userprofile/${user.id}`}>
                <button className="suggested-user-button">{user.username}</button>
              </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
    
};

export default UserRecommendations;