import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';


function PostUpload() {
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');  
    let {authTokens, logoutUser} = useContext(AuthContext);  
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
    }
    const uploadPost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('text', text);

        let response = await fetch('http://localhost:8000/api/posts/', {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${authTokens.access}`,
            },
            body: formData
        })
        let data = await response.json()
        if(response.status === 201){
            console.log("it said okau")
            setImage(data)
            navigate('/')
        }else{
            alert('Something went wrong here :(')
        }
    }

    return (
        <form onSubmit={uploadPost}>
            <input type="file"
                    id="image"
                    accept="image/png, image/jpeg, image/jpg" name="image" onChange={handleImageChange} />
            <input type="text" name="text" value={text} onChange={handleTextChange} />
            <button type="submit">Create Post</button>
        </form>
    );
}

export default PostUpload;