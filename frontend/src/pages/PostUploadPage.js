import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/postUpload.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UploadButton } from '../components/UploadButton'
import { config } from '../utils/env'



function CombinedUpload() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');  
    const [uploadType, setUploadType] = useState('post'); // By default, set it to 'post'
    const [isLoading, setIsLoading] = useState(false);
    const BadWords = require('bad-words');
    const filter = new BadWords();
    
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

    const isContentAppropriate = (text) => {
        return !filter.isProfane(text);
    }

    const convertToBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Split the result on the comma and return the part after it
                const base64Data = reader.result.split(',')[1];
                resolve(base64Data);
            };
            reader.onerror = error => reject(error);
        });
    };
    
    
    

    const handleUpload = async (e) => {
        e.preventDefault();
        setIsLoading(true)
    
        if (!isContentAppropriate(text)) {
            toast.error('Your content has inappropriate text. Please modify and try again.');
            setIsLoading(false)
            return;
        }
    
        const base64Data = await convertToBase64(file);
    
        try {
            // First, check content safety
            let safetyResponse = await fetch(`${config.apiUrl}/check_content_safety/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: JSON.stringify({ base64: base64Data })
            });
    
            safetyResponse = await safetyResponse.json();
    
            if (!safetyResponse.safe) {
                toast.error('Your image contains inappropriate content. Please upload a different image.');
                setIsLoading(false)
                return;
            }
    
            // If the content is safe, proceed with the upload
            const formData = new FormData();
            formData.append(uploadType === 'post' ? 'image' : 'content', file);
            formData.append(uploadType === 'post' ? 'text' : 'caption', text);
    
            const url = uploadType === 'post' ? `${config.apiUrl}/posts/` : `${config.apiUrl}/stories/`;
    
            let uploadResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData
            });
    
            let data = await uploadResponse.json();
            if (uploadResponse.status === 201) {
                setIsLoading(false)
                toast.success('Moment uploaded successfully');
                navigate('/');
            } else {
                setIsLoading(false)
                toast.error('Error encountered during upload: ' + data.error);
            }
    
        } catch (error) {
            setIsLoading(false)
            console.error('Error during content safety check or upload:', error);
            toast.error('An error occurred. Please try again later.');
        }
    };
    
    
    
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
                <UploadButton isLoading={isLoading} handleClick={handleUpload} />
            </form>
        </div>
    );
};

export default CombinedUpload;
