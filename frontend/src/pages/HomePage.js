import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import '../css/home.css'
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sidebar } from './Sidebar.tsx';

const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens} = useContext(AuthContext);
    let [comment, setComment] = useState('');
    let {user} = useContext(AuthContext)
    
    
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
                const likedPosts = data.map((post) => {
                  if(post.likes.some((like) => like.id = user.id)){
                    return post.id;
                  }
                  return null;
                }).filter(Boolean);
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
                setPosts(data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error)
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
          // const data = await response.json();
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

    let handleLike = async (post) => {
      const postId = post.id;
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
    
        let data = await response.json();
        if (response.status === 200) {
          let updatedPosts = posts.map((p) => {
            if(p.id === postId){
              p.likes.push(data);
            }
            return p;
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
    }, []);


    return (
        <div className='homePage'>
          <Sidebar/>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <p>{post.id.username}</p>
                <img src={`http://localhost:8000${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post} style={{maxWidth: '200px'}} />
                <span>{post.user.username}: </span>{post.text ? <p>{post.text}</p> : <p>No caption available</p>}
                <div>
                <button onClick={() => handleLike(post)}>
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

