import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom';


const FollowButton = () => {
    let {authTokens} = useContext(AuthContext);
    const { userId, following } = useParams();
    let [isFollowing, setIsFollowing] = useState(following);


    let handleFollow = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/users/${userId}/follow/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });

            // let data = await response.json();
            if(response.status === 200){
                setIsFollowing(true);
                // isFollowing(true);
            } else{
                throw new Error(response.statusText);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    let handleUnFollow = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/users/${userId}/unfollow/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });

            // let data = await response.json();
            if(response.status === 200){
                setIsFollowing(false);
                // isFollowing(false);
            } else{
                throw new Error(response.statusText);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await fetch(
              `http://localhost:8000/api/user/${userId}/profile`,
              {
                headers: {
                  Authorization: `Bearer ${authTokens.access}`,
                },
              }
            );
            const data = await response.json();
            setIsFollowing(data.is_following);
          } catch (error) {
            console.error(error);
          }
        }
        fetchData();
      }, [userId, authTokens]);
      


    return(
        <button onClick={isFollowing ? handleUnFollow : handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
    )

};

export default FollowButton;