import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const BlockButton = ({ userId }) => {
    const { authTokens } = useContext(AuthContext);
    let [isBlocked, setIsBlocked] = useState(false);


    const getBlocked = async () => {
        try{
            let response = await fetch(`http://localhost:8000/api/user/${userId}/block_status/`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            const data = await response.json();
            if(response.status === 200){
                setIsBlocked(data.is_blocked);
                // console.log("User blocked status:", data.is_blocked);

            } else{
                throw new Error(response.statusText)
            }
        }
        catch(error){
            console.log(error)
        }
    };


    const handleBlock = async () => {
        let action = isBlocked ? 'unblock' : 'block';

        try{
            let response = await fetch(`http://localhost:8000/api/user/${userId}/toggle_block/?action=${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            })

            if(response.status === 204){
                setIsBlocked(!isBlocked);
            } else{
                throw new Error(response.statusText)
            }
        }
        catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        getBlocked();
    },[]);

    return (
        <button onClick={handleBlock}>
            {isBlocked ? 'Unblock' : 'Block'}
        </button>
    )

};

export default BlockButton;