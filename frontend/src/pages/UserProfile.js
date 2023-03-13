import React, {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import FollowButton from './Follow';

const UserProfilePage = () => {
    const { userId } = useParams();
    let [user, setUser] = useState(null);
    let {authTokens, logoutUser} = useContext(AuthContext);


    let getUserInfo = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/user/${userId}/profile/`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authTokens.access}`,
                },
            });

            let data = await response.json();
            if(response.status === 200){
                setUser(data);
            } else{
                throw new Error(response.statusText);
            }
        } catch(error){
            console.log(error)
        }
    };
    useEffect(() => { 
        getUserInfo();
    }, []);


    return(
        <div>
            {user ? (
                <div>
                    <h2>{user.username}'s Profile</h2>
                    <p>Name: {user.first_name} {user.last_name}</p>
                    <p>Email: {user.email}</p>
                    <p>Bio: {user.bio}</p>
                    <FollowButton userId={user.id} following={user.is_following} setFollowing={null} />
                </div>
                ) : (
            <p>Loading...</p>
            )}
        </div>
);
};

export default UserProfilePage;