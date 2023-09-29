import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import '../css/home.css'
import '../css/sidebar.css'
import { faHeart, faComment, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserRecommendations from './UserRecommendations';
import { Pagination } from 'react-bootstrap';
import StoriesComponent from './StoriesComponent';


const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens} = useContext(AuthContext);
    let [comments, setComments] = useState({});
    let {user} = useContext(AuthContext);
    let [currentPage, setCurrentPage] = useState(1);
    let [nextPage, setNextPage] = useState(null);
    let [prevPage, setPrevPage] = useState(null);

    const [reportedPosts, setReportedPosts] = useState(
      () => JSON.parse(localStorage.getItem(`reportedPosts_${user.id}`)) || []
  );
  
    
    
    let getPosts = async (page) => {
        try {
          let response = await fetch(`http://localhost:8000/api/posts/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
            let data = await response.json();
            if (response.status === 200) {
                const likedPosts = data.results.map((post) => {
                  if(post.likes.some((like) => like.id === user.id)){
                    return post.id;
                  }
                  return null;
                }).filter(Boolean);
                localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
                setPosts(data.results);
                setNextPage(data.next);
                setPrevPage(data.previous);
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error)
        }
    };

    let handleComment = async (postId) => {
      const commentText = comments[postId];
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
            getPosts(currentPage);
            setComments({ ...comments, [postId]: '' });
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
          alert(error.message)
      }
    };

    const handleReport = async (post) => {
      if (reportedPosts.includes(post.id)) {
        alert('You have already reported this post.');
        return;
      }

      try {
          let response = await fetch(`http://localhost:8000/api/posts/${post.id}/report/`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${authTokens.access}`,
              },
          });

          let data = await response.json();
          if (response.status === 200) {
              console.log('reported')
              getPosts(currentPage); // Refresh posts after reporting
              alert(data.message);
              
              let updatedReportedPosts = [...reportedPosts, post.id];
              setReportedPosts(updatedReportedPosts);
              localStorage.setItem(`reportedPosts_${user.id}`, JSON.stringify(updatedReportedPosts));

          } else {
              throw new Error(response.statusText);
          }
      } catch (error) {
          console.log(error);
      }
    };

    let handlePageChange = async (newPage) => {
      if (newPage < 1) {
        console.log("There's no previous page.");
        return;
      }
    
      if (!nextPage && newPage > currentPage) {
        console.log("There's no next page.");
        return;
      }
    
      setCurrentPage(newPage);
      getPosts(newPage);
    };
    
  
    
    useEffect(() => { 
        getPosts(currentPage);
    }, []);


    return (
        <div className='homePage'>
           <div className="content-container">
              <div className='posts-container'>
                <StoriesComponent />
                <div style={{display: "flex", flexGrow: 10,}}>
                  <ul>
                    {posts.map((post) => (
                      <li key={post.id}>
                        {/* Profile picture and username */}
                      <div className="profile-header">
                        <div className="profile-info">
                          <img
                            className="profile-picture"
                            src={`http://localhost:8000${post.user.profile_picture || '/Desktop/default_user.jpg'}`}
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
                        <div className='actions'>
                        <button onClick={() => handleLike(post)}>
                          <FontAwesomeIcon icon={faHeart} />
                          {/* <span>{post.likes.length}</span> */}
                        </button> <button onClick={() => handleComment(post.id)}>
                            <FontAwesomeIcon icon={faComment} className="comment-icon" />
                          </button>
                        </div>
                        <div className='likes'>
                          <span>Liked by {post.likes.length}</span>
                        </div>
                        <div>
                          <input 
                            type="text" 
                            placeholder="Add a comment" 
                            value={comments[post.id] || ''} 
                            onChange={(e) => 
                              setComments({ ...comments, [post.id]: e.target.value })
                            } 
                          />
                          {/* <ul>
                          {post.comments.map((comment) => (
                            <li key={comment.id}>
                              <p style={{ color: 'black' }}>{comment.user.username}</p>  <span> : </span> <p style={{ color: 'black' }}>{comment.comment_text}</p>
                            </li>
                          ))}
                        </ul> */}
                          </div>
                        </li>
                      ))}
                  </ul>
                  </div>
                  <div className='pagination-container'>
                      <Pagination>
                          <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!prevPage}
                          />
                          <Pagination.Item active>{currentPage}</Pagination.Item>
                          <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!nextPage}
                          />
                      </Pagination>
                    </div>
                </div>
          </div>
          <div className="recommendations-container1">
            <UserRecommendations/>
        </div>
      </div>
      );

};
export default HomePage;


