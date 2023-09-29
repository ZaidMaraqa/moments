import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/StoriesComponent.css'; // Import your CSS file

const StoriesComponent = () => {
  let [stories, setStories] = useState([]);
  let { authTokens } = useContext(AuthContext);
  const [currentStory, setCurrentStory] = useState(null);
  const [isStoryModalActive, setIsStoryModalActive] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  
  const getStories = async () => {
    try {
      let response = await fetch('http://localhost:8000/api/stories/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });

      let data = await response.json();
      if (response.status === 200) {
        setStories(data);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStories();
}, []); // Empty dependency array to ensure it only runs once



  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentStory(stories[currentStoryIndex + 1]);
    }
  };
  
  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentStory(stories[currentStoryIndex - 1]);
    }
  };
  
  const openStory = (story, index) => {
    setCurrentStoryIndex(index);
    setCurrentStory(story);
    setIsStoryModalActive(true);
  };
  

  const closeStory = () => {
    setIsStoryModalActive(false);
  };

  useEffect(() => {
    if (isStoryModalActive && currentStoryIndex !== null) {
        let timer = setTimeout(nextStory, 5000); // progresses after 5 seconds
        let progressInterval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress < 100) return prevProgress + 1;
                clearInterval(progressInterval);
                return prevProgress;
            });
        }, 50);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }
}, [isStoryModalActive, currentStoryIndex]);

  if (!stories || stories.length === 0) {
    console.log(stories)
    return <div>No stories available.</div>; // Placeholder for no stories
  }


  return (
    <div>
        <div className="stories-container">
            {stories.map((story, index) => (
                <div key={story.id} className="story-profile" onClick={() => openStory(story, index)}>
                    <img src={`http://localhost:8000${story.user.profile_picture}`} alt="Profile" />
                    <div className="story-username">{story.user.username}</div>
                </div>
            ))}
        </div>
        {isStoryModalActive && (
            <div className="story-modal">
                <div className="progress-bars-container">
                    {stories.map((_, index) => (
                        <div
                            key={index}
                            className={`progress-bar ${index <= currentStoryIndex ? 'active' : ''}`}
                            style={index === currentStoryIndex ? { width: `${progress}%` } : {}}
                        />
                    ))}
                </div>
                <div className="story-carousel">
                    {stories.map((story, index) => (
                        <div className="story-content" style={index === currentStoryIndex ? { display: 'flex' } : { display: 'none' }}>
                            <div className="story-header">
                                <img src={`http://localhost:8000${story.user.profile_picture}`} alt="Profile" />
                                <div className="username4">{story.user.username}</div>
                            </div>
                            <img src={`http://localhost:8000${story.content}`} alt="Story" />
                        </div>
                    ))}
                </div>
                <button className="close-button" onClick={closeStory}>X</button>
                <div className="story-arrow story-arrow-left" onClick={prevStory}>◀</div>
                <div className="story-arrow story-arrow-right" onClick={nextStory}>▶</div>
            </div>
        )}
    </div>
);

};

export default StoriesComponent;
