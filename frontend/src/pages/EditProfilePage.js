import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/editprofile.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfilePage = () => {
    let {authTokens} = useContext(AuthContext)
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const defaultProfilePicture = '/desktop/default_user.jpg'

    let isValidImage = (file) => {
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];


        console.log('File type:', file.type); 

        if(file && acceptedImageTypes.includes(file.type)){
            return true;
        }
        else{
            return false;
        }
    };

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
            if(isValidImage(profilePicture)){
                formData.append('profile_picture', profilePicture);
            } else{
                console.error('Invalid image file, please upload a jpg,png,gif');
            }
        }

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
          }

        
        let response = await fetch(`http://localhost:8000/api/user/${userId}/edit/`, {
            method:'PATCH',
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
            toast.error('Failed to edit profile due to:' + data.error)
            throw new Error(response.statusText);
        }
    };


    return (
        <div className="editprofile-container">
            <h2>Edit Profile</h2>
                <form className="form2" onSubmit={editProfile} encType="multipart/form-data">
            <div className="textbox1">
                <label className="input-label2" htmlFor="username">Username</label>
                <input type="text" id="username" name={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="textbox1">
                <label className="input-label2"  htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="textbox1">
                <label className="input-label2" htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="textbox1">
                <label className="input-label2" htmlFor="bio">Bio</label>
                <input type="text" id="bio" name={lastName} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="textbox1">
                <label className="input-label2"  htmlFor="profilePicture">Profile Picture</label>
                <input type="file" id="profilePicture" name="profilePicture" onChange={(e) => setProfilePicture(e.target.files[0])} />
            </div>
            {user && (
                <div className="profile-picture-container3">
                <img src={profilePicture || user.profile_picture || defaultProfilePicture} alt="Profile" />
                </div>
            )}
            <button className='bazinga'type="submit">Save Changes</button>
            </form>
        </div>
    );

};


export default EditProfilePage;


