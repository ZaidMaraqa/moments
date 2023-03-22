import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom'

const UserRecommendations = () => {
    let { authTokens, user:currentUser } = useContext(AuthContext);
    let [recommendedUsers, setRecommendedUsers] = useState([]);


    const getRecommendations = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/users/${currentUser.id}/recommendations/`,{
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


    return(
        <div>
            <h3>Suggested Users!</h3>
            <ul>
                {recommendedUsers.map(user => (
                    <li key={user.id}>
                        <Link to={`/userprofile/${user.id}`}>
                        {user.username}
                        </Link> 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserRecommendations;