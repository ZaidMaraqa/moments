import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../css/uploadstory.css'


function UploadStory(){
    const [story, setStory] = useState(null);
    const [caption, setCaption] = useState('');
    let { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleStoryChange = (e) => {
        setStory(e.target.files[0])
    }

    const handleCaptionChange = (e) => {
        setCaption(e.target.value)
    }

    const postStory = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('content', story)
        formData.append('caption', caption)

        try{
          let response = await fetch('http://localhost:8000/api/stories/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authTokens.access}`,
            },
            body: formData
          });
          let data = await response.json()
          console.log(data)
          if(response.status === 201){
            setStory(data)
            navigate('/')
          }else{
            alert('Something went wrong')
          }   
        } catch(error){
          console.log(error)
        }
      }


      return(
        <div className='post-story-container'>
            <form className='storyForm' onSubmit={postStory}>
                <div className='story-wrap'>
                    <label htmlFor='story'>Story:</label>
                    <input
                        type='file'
                        id='story'
                        accept="image/png, image/jpeg, image/jpg"
                        name='story'
                        onChange={handleStoryChange}
                        className='story-input'                    
                    />
                </div>
                <div className='story-wrap'>
                    <label htmlFor='caption'>Caption:</label>
                    <input
                        type='text'
                        name='caption'
                        value={caption}
                        onChange={handleCaptionChange}
                        className='story-input'
                    />
                </div>
                <button type='submit' className='story-button'>
                    Share Story!
                </button>
            </form>
        </div>

      );
};

export default UploadStory;