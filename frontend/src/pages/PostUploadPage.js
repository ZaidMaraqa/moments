import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/postUpload.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CombinedUpload() {
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');  
    const [uploadType, setUploadType] = useState('post'); // By default, set it to 'post'
    const BadWords = require('bad-words');
    const filter = new BadWords();


    const Clarifai = require('clarifai');
    const clarifaiApp = new Clarifai.App({ apiKey: '239d424aa1fe4a7bbbf65d8d7a88e9a5' });
    
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
    
        if (!isContentAppropriate(text)) {
            toast.error('Your content has inappropriate text. Please modify and try again.');
            return; // Stop the function execution here
        }

        const base64Data = await convertToBase64(file);
    
        try {
            const clarifaiResponse = await clarifaiApp.models.predict(Clarifai.MODERATION_MODEL, {base64: base64Data});
            console.log("Sending image data:");


            console.log(clarifaiResponse)
    
            // Extracting the concepts from the Clarifai response
            const concepts = clarifaiResponse.outputs[0].data.concepts;
            const explicitContent = concepts.find(concept => concept.name === "safe");
            console.log(explicitContent.value)
    
            if (explicitContent && explicitContent.value < 0.95) {
                // If explicit content is detected with high confidence, reject the upload
                toast.error('Your image contains inappropriate content. Please upload a different image.');
                return;
            }
            else{
                toast.success('good')
            }
    
            // If no inappropriate content is detected, proceed with the upload
            const formData = new FormData();
            formData.append(uploadType === 'post' ? 'image' : 'content', file);
            formData.append(uploadType === 'post' ? 'text' : 'caption', text);
    
            const url = uploadType === 'post' ? 'http://localhost:8000/api/posts/' : 'http://localhost:8000/api/stories/';
    
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
                body: formData
            });
    
            let data = await response.json();
            if (response.status === 201) {
                toast.success('Moment uploaded succesfully');
                setFile(data);
                navigate('/');
            } else {
                console.log('claras response' + clarifaiResponse);

                console.log(response.status)
                toast.error('Error encountered:' + data.error);
            }
        } catch (error) {
            console.error('Error during content moderation or upload:', error);
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
                <button type="submit" className="upload-button">
                    {uploadType === 'post' ? 'Share Moment' : 'Share Story!'}
                </button>
            </form>
        </div>
    );
};

export default CombinedUpload;
