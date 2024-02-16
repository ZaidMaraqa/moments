import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/request.css'
import { config } from '../utils/env'



const FollowRequests = ({ userId }) => {
    let { authTokens, user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);



    let handleAccept = async (requesterId) => {
        if(authTokens && requesterId){
            try{
                let response = await fetch(`${config.apiUrl}/users/${requesterId}/accept_follow_request/`, {
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
                    console.log(responseData)
                }
            }catch(error){
                toast.error('Something went wrong')
            }
        }
    }

    let handleDecline = async (requesterId) => {
        if(authTokens && requesterId){
            try{
                let response = await fetch(`${config.apiUrl}/users/${requesterId}/reject_follow_request/`, {
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
                    console.log(responseData)
                }
            }catch(error){
                toast.error('Something went wrong')
            }
        }
    }


    let getFollowRequests = async () => {
        try{
            let response = await fetch(`${config.apiUrl}/users/${userId}/follow_requests/`, {
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
            {requests.length === 0 ? (
                <p>No follow requests...</p>
            ) : (
                <ul>
                    {requests.map((request) => (
                        <li key={request.id} className="request-item">
                            <img src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${request.profile_picture}` || '/Desktop/default_user.jpg'} alt={user.username} />
                            <span>{request.username}</span>
                            <div className='mateen'>
                                <button onClick={() => handleAccept(request.id)}>Accept</button>
                                <button onClick={() => handleDecline(request.id)}>Decline</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
    
}

export default FollowRequests;
