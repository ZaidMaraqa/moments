import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';



const EditProfilePage = () => {
    let {authTokens} = useContext(AuthContext)
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');



    let editProfile = async (e ) => {
        e.preventDefault();

        const formData = new FormData();
        if(username){
            formData.append('username', username);
        }
        if(firstName){
            formData.append('first_name', firstName);
        }
        if(lastName){
            formData.append('last_name', lastName);
        }
        if(bio){
            formData.append('bio', bio);
        }
        if(profilePicture){
            formData.append('profile_picture', profilePicture);
        }

        
        let response = await fetch(`http://localhost:8000/api/user/${userId}/edit/`, {
            method:'PUT',
            headers: {
                'Authorization': `Bearer ${authTokens.access}`,
            },
            body:formData,
        });
        let data = await response.json();
        console.log(data);
        if(response.status === 200){
            setUser(data);
            navigate(`/userprofile/${userId}`)
        }
        else{
            throw new Error(response.statusText);
        }
    }

    return(
        <div className='editprofile-container'>
            <h2>Edit Profile</h2>
            <form onSubmit={editProfile}>
                <label>
                    Username:
                    <input type="text" name={username} onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    First Name:
                    <input type="text" name={firstName} onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>
                    Last Name:
                    <input type="text" name={lastName} onChange={e => setLastName(e.target.value)}/>
                </label>
                <label>
                    Bio:
                    <textarea name={bio} onChange={e => setBio(e.target.value)}/>
                </label>
                <label>
                    Profile Picture:
                    <input type="file" name="profilePicture" onChange={e => setProfilePicture(e.target.files[0])}/>
                </label>
                <button type='submit'>Save Changes</button>
            </form>
        </div>
    )

};


export default EditProfilePage;


