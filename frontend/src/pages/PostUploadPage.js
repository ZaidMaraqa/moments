import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/postUpload.css'

function CombinedUpload() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');  
    const [uploadType, setUploadType] = useState('post'); // By default, set it to 'post'
    
    let { authTokens } = useContext(AuthContext);  
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
    }

    const handleUploadTypeChange = (e) => {
        setUploadType(e.target.value);
    }

    const handleUpload = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append(uploadType === 'post' ? 'image' : 'content', file);
        formData.append(uploadType === 'post' ? 'text' : 'caption', text);

        const url = uploadType === 'post' ? 'http://localhost:8000/api/posts/' : 'http://localhost:8000/api/stories/';

        let response = await fetch(url, {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${authTokens.access}`,
            },
            body: formData
        })
        
        let data = await response.json()
        if(response.status === 201){
            setFile(data);
            navigate('/');
        }else{
            alert('Something went wrong here :(');
        }
    }
    
    return (
        <div className="upload-container">
            <form className="uploadForm" onSubmit={handleUpload}>
                <div className="input-wrapper">
                    <label htmlFor="uploadType">Upload Type:</label>
                    <select id="uploadType" value={uploadType} onChange={handleUploadTypeChange}>
                        <option value="post">Post</option>
                        <option value="story">Story</option>
                    </select>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="file">{uploadType === 'post' ? 'Moment:' : 'Story:'}</label>
                    <input
                        type="file"
                        id="file"
                        accept="image/png, image/jpeg, image/jpg"
                        name="file"
                        onChange={handleFileChange}
                        className="upload-input"
                    />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="text">Caption:</label>
                    <input
                        type="text"
                        name="text"
                        value={text}
                        onChange={handleTextChange}
                        className="upload-input"
                    />
                </div>
                <button type="submit" className="upload-button">
                    {uploadType === 'post' ? 'Share Moment' : 'Share Story!'}
                </button>
            </form>
        </div>
    );
};

export default CombinedUpload;
