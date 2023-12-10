import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../css/StoriesComponent.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { config } from '../utils/env'
// import Carousel from '../components/Carousel'; 


const StoriesComponent = () => {
  let [stories, setStories] = useState([]);
  let { authTokens } = useContext(AuthContext);
  const [currentStory, setCurrentStory] = useState(null);
  const [isStoryModalActive, setIsStoryModalActive] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(new Array(stories.length).fill(0)); // Initialize with zeros

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 5,  // Number of images you want to show
    slidesToScroll: 1,
    arrows: true,
  };
  
  const getStories = async () => {
    try {
      let response = await fetch(`${config.apiUrl}/stories/`, {
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
  }, []);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentStory(stories[currentStoryIndex + 1]);
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      console.log(currentStory)
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
        let timer = setTimeout(nextStory, 5000);
        const increment = 100 / (5000 / 50); 
        let progressInterval = setInterval(() => {
            setProgress((prevProgresses) => {
                let newProgresses = [...prevProgresses];
                if (newProgresses[currentStoryIndex] < 100) {
                    newProgresses[currentStoryIndex] += increment;
                } else {
                    clearInterval(progressInterval);
                }
                return newProgresses;
            });
        }, 50);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }
  }, [isStoryModalActive, currentStoryIndex]);

  if (!stories || stories.length === 0) {
    return <div>No stories available.</div>;
  }

  const uniqueStories = stories.reduce((acc, current) => {
    const isExist = acc.find(story => story.user.id === current.user.id);
    if (!isExist) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  

  return (
    <div>
      <Slider {...settings}>
          {uniqueStories.map((story, index) => (
              <div key={story.id} className={`story-profile ${index <= currentStoryIndex ? "viewed-story" : ""}`} onClick={() => openStory(story, index)}>
                  <img src={`${story.user.profile_picture}`} alt="Profile" />
                  <div className="story-username">{story.user.username}</div>
              </div>
          ))}
      </Slider>
        {isStoryModalActive && (
              // <Carousel slides={carouselSlides} />
            <div className="story-modal">
                <div className="story-carousel">
                    {stories.map((story, index) => (
                        <div key={story.id} className="story-content" style={index === currentStoryIndex ? { display: 'flex' } : { display: 'none' }}>
                            <div className="progress-bars-container">
                                {stories.map((story, index) => (
                                    <div 
                                        key={story.id}
                                        className={`progress-bar ${index <= currentStoryIndex ? "viewed" : ""}`}
                                        style={{ width: `${progress[index]}%` }} 
                                    ></div>
                                ))}
                            </div>
                            <div className="story-header">
                                <img src={`${story.user.profile_picture}`} alt="Profile" />
                                <div className="username4">{story.user.username}</div>
                            </div>
                            <img src={`${story.content}`} alt="Story" />
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

