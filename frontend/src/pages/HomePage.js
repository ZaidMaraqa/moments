import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../css/home.css'
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);
    let [comment, setComment] = useState('');
    let [data, setData] = useState({ results: [] });
    let [searchUser, setSearchUser] = useState('')
    let {user} = useContext(AuthContext)

    let searchUsers = async () => {
      try {
        let response = await fetch(`http://localhost:8000/api/userList?username=${encodeURIComponent(searchUser)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
        
        let data = await response.json();
        if (response.status === 200) {
          setData(data);
        } else {
          throw new Error(response.statusText);
        }
      } catch (error) {
        console.log(error);
        // logoutUser();
      }
    };
    
    
    let getPosts = async () => {
        try {
            let response = await fetch('http://localhost:8000/api/posts/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if (response.status === 200) {
                setPosts(data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            logoutUser();
        }
    };

    let handleComment = async (postId, commentText) => {
        try {
          const response = await fetch(`http://localhost:8000/api/posts/${postId}/comment/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify({
              post: postId,
              comment_text: commentText,
              user: user.id
            })
          });
          const data = await response.json();
          console.log(data)
          if (response.status === 201) {
            // refresh posts
            getPosts();
            setComment("");
            console.log(commentText)
          } 
          else {
            throw new Error(response.statusText);
          }
        } catch (error) {
          console.log(error);
        //   logoutUser();
        }
    };

    let handleLike = async (postId) => {
      try {
        let alreadyLiked = JSON.parse(localStorage.getItem('likedPosts')) || [];
        if (alreadyLiked.includes(postId)) {
          // User has already liked this post
          return;
        }
    
        let response = await fetch(`http://localhost:8000/api/posts/${postId}/like/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
    
        console.log(response)
        let data = await response.json();
        if (response.status === 200) {
          let updatedPosts = posts.map(post => {
            if (post.id === postId) {
              post.likes.push(data);
            }
            return post;
          });
          setPosts(updatedPosts);
          
          // Update local storage to reflect that the user has liked this post
          alreadyLiked.push(postId);
          localStorage.setItem('likedPosts', JSON.stringify(alreadyLiked));
        } else {
            throw new Error(response.statusText);
        }
      } catch (error) {
        // console.log(error);
        // logout
      }
    }
    
    useEffect(() => { 
        getPosts();
        searchUsers();
    }, [searchUser]);


    return (
        <div className='homePage'>
          <input type="search" 
          placeholder='Search...' 
          value={searchUser} onChange={e => {setSearchUser(e.target.value);
          }}
          />
          <ul>
            {data.results && data.results.map(srch => <li key={srch.username}> <Link to={`/userprofile/${srch.user_id}`}>{srch.username}</Link></li>)}
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.id.username}</p>
                <img src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post} style={{maxWidth: '300px'}} />
                <span>{post.user.username}: </span>{post.text ? <p>{post.text}</p> : <p>No caption available</p>}
                <div>
                <button onClick={() => handleLike(post.id)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span>{post.likes.length}</span>
                </button>
                </div>
                <div>
                  <input type="text" placeholder="Add a comment" onChange={(e) => setComment(e.target.value)} />
                  <button onClick={() => handleComment(post.id, comment)}>
                    <FontAwesomeIcon icon={faComment} className="comment-icon" />
                    <span>Comment</span>
                  </button>
                  <ul>
                    {post.comments.map((comment) => (
                      <li key={comment.id}>
                        <p>{comment.user.username}</p>
                        <span> || </span>
                        <p>{comment.comment_text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          {/* <Link to='/postupload'>
            <button>Create Post</button>
          </Link> */}
        </div>
      );

};
export default HomePage;

