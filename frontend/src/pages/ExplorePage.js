import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { faThumbsUp, faComment, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserRecommendations from './UserRecommendations';
import { HomePageFunctions } from '../components/HomePageFunctions';

const ExplorePage = () => {

    const { handleLike, handleComment, handleReport } = HomePageFunctions;
    let {authTokens} = useContext(AuthContext);
    let [posts, setPosts] = useState([]);
    let [comment, setComment] = useState('');


    let getRecommendedPosts = async () => {
        try{
            let response = await fetch('http://localhost:8000/api/recommended_posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if(response.status === 200){
                setPosts(data)
            } else {
                throw new Error(response.statusText)
            }
        }
        catch(error){
            console.log(error)
        }
    };

    useEffect(() => {
        getRecommendedPosts();
    }, []);
    

    return(
        <div className='explorePage'>
            <div className='content-container'>
                <ul>
                    {posts.map((post) => (
                      <li key={post.id}>
                        {/* Profile picture and username */}
                      <div className="profile-header">
                        <div className="profile-info">
                          <img
                            className="profile-picture"
                            src={`http://localhost:8000${post.user.profile_picture || '/media/images/default.png'}`}
                            alt={`${post.user.username}'s Profile Picture`}
                          />
                          <span className="username">{post.user.username}</span>
                        </div>
                            <button className="report-button" onClick={() => handleReport(post)}>
                              <FontAwesomeIcon icon={faFlag} />
                            </button>
                      </div>
                      <div className='post-content'>
                        <img src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post}  />
                      </div>
                      <div className='caption'>
                        <span><b>{post.user.username}</b> </span><span>{post.text ? post.text : 'No caption available'}</span>
                      </div>
                        <div>
                        <button onClick={() => handleLike(post)}>
                          <FontAwesomeIcon icon={faThumbsUp} />
                          <span>{post.likes.length}</span>
                        </button> <button onClick={() => handleComment(post.id, comment, authTokens, getRecommendedPosts, authTokens.user, setComment)}>
                            <FontAwesomeIcon icon={faComment} className="comment-icon" />
                          </button>
                        </div>
                        <div>
                          <input type="text" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                          {/* <ul>
                            {post.comments.map((comment) => (
                              <li key={comment.id}>
                                <p>{comment.user.username}</p>
                                <span> || </span>
                                <p>{comment.comment_text}</p>
                              </li>
                            ))}
                          </ul> */}
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div className="recommendations-container">
                    <UserRecommendations/>
                </div>
            </div>
        </div>
    )
}

export default ExplorePage;