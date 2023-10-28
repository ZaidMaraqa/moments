import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/request.css'

// Assuming you have a service to fetch follow requests and handle accept/decline

const FollowRequests = ({ userId }) => {
    let { authTokens, user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);



    let handleAccept = async () => {
        if(authTokens && userId){
            try{
                let response = await fetch(`http://localhost:8000/api/users/${userId}/accept_follow_request/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                
                });

                let responseData = await response.json();

                if(response.status === 200){
                    toast.success('Follower added!')
                } else{
                    toast.error('Something went wrong')
                }
            }catch(error){
                toast.error('Something went wrong')
            }
        }
    }

    let handleDecline = async () => {
        if(authTokens && userId){
            try{
                let response = await fetch(`http://localhost:8000/api/users/${userId}/reject_follow_request/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`,
                    }
                
                });

                let responseData = await response.json();

                if(response.status === 200){
                    toast.info('Follow request rejected')
                } else{
                    toast.error('Something went wrong...')
                }
            }catch(error){
                toast.error('Something went wrong')
            }
        }
    }


    let getFollowRequests = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/users/${userId}/follow_requests/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            })

            let data = await response.json();

            if(response.status === 200){
                setRequests(data)
            } else{
                toast.error('Could not fetch follows')
            }
        } catch(error){
            toast.error('Something went wrong')
        }
    }


    useEffect(() => {
        getFollowRequests(userId);
    }, [])

    return (
        <div className="follow-requests">
            <h2>Follow Requests</h2>
            <ul>
                {requests.map(request => (
                    <li key={userId} className="request-item">
                        <img src={user.profile_picture} alt={user.username} />
                        <span>{user.username}</span>
                        <button onClick={() => handleAccept(request.user.id)}>Accept</button>
                        <button onClick={() => handleDecline(request.user.id)}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FollowRequests;
