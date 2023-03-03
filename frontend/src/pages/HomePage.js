import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../css/home.css'

const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens, logoutUser} = useContext(AuthContext);
    let [comment, setComment] = useState('');
    
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
              comment_text: commentText
            })
          });
          const data = await response.json();
          console.log(data)
          if (response.status === 201) {
            // refresh posts
            getPosts();
            setComment(data);
          } 
          else {
            throw new Error(response.statusText);
          }
        } catch (error) {
          console.log(error);
        //   logoutUser();
        }
    }

    let handleLike = async (postId) => {
        try {
            let response = await fetch(`http://localhost:8000/api/posts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if (response.status === 200) {
                // Update the posts array with the new like
                let updatedPosts = posts.map(post => {
                    if (post.id === postId) {
                        post.likes.push(data);
                    }
                    return post;
                });
                setPosts(updatedPosts);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
            logoutUser();
        }
    };

    useEffect(() => { 
        getPosts();
    }, []);

    return (
        <div className='homePage'>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.id.username}</p>
                <img src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post} style={{maxWidth: '300px'}} />
                {post.text ? <p>{post.text}</p> : <p>No caption available</p>}
                <div>
                  <button onClick={() => handleLike(post.id)}>Like</button>
                  <span>{post.likes.length}</span>
                </div>
                <div>
                  <input type="text" placeholder="Add a comment" onChange={(e) => setComment(e.target.value)} />
                  <button onClick={() => handleComment(post.id, comment)}>Comment</button>
                  <ul>
                    {post.comments.map((comment) => (
                      <li key={comment.id}>
                        <p>{comment.user.username}</p>
                        <p>{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <Link to='/postupload'>
            <button>Create Post</button>
          </Link>
        </div>
      );

};
export default HomePage;

