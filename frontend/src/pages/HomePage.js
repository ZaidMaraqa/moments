import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../context/AuthContext';
import '../css/home.css'
import '../css/sidebar.css'
import { faHeart, faComment, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserRecommendations from './UserRecommendations';
// import { Pagination } from 'react-bootstrap';
import StoriesComponent from './StoriesComponent';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostWithComments from '../components/PostWithComments';
import PaginationPosts from '../components/Pagination';
import { config } from '../utils/env'

const HomePage = () => {
    let [posts, setPosts] = useState([]);
    let {authTokens} = useContext(AuthContext);
    let [comments, setComments] = useState({});
    let {user} = useContext(AuthContext);
    let [activePage, setActivePage] = useState(1);
    let [nextPage, setNextPage] = useState(null);
    let [prevPage, setPrevPage] = useState(null);
    let [pageCount, setPageCount] = useState();
    let [activePost, setActivePost] = useState(null);


    const closeModal = async () => {
      setActivePost(null);
    }



    const [reportedPosts, setReportedPosts] = useState(
      () => JSON.parse(localStorage.getItem(`reportedPosts_${user.id}`)) || []
    );

    // Gets the total number of non-paginated posts for pagination purposes.
    let getTotalPosts = async () => {
      try {
          let response = await fetch(`${config.apiUrl}/post`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            
          let data = await response.json();
  
          if(response.status === 200){
              const pageTotl = Math.ceil(data.length / 10)
              setPageCount(pageTotl); 
              console.log("Page count set to " + pageTotl)
          }
      } catch (error) {
          console.log(error)
      }
  };
  
    
    
    let getPosts = async (page) => {
        try {
          let response = await fetch(`${config.apiUrl}/posts/?page=${page}`, {
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

    let handleComment = async (post) => {
        const postId = post.id;
        const commentText = comments[postId] || '';

        // If the comment is empty, just open the modal and return
        if (!commentText.trim()) {
          setActivePost(post);
          return;
        }

      
        try {
          const response = await fetch(`${config.apiUrl}/posts/${postId}/comment/`, {
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
            toast.success('Comment posted!')
            // refresh posts
            getPosts(activePage);
            setComments({ ...comments, [postId]: '' });
            setActivePost(post);
          } 
          else {
            throw new Error(response.statusText);
          }
        } catch (error) {
          console.log(error);
        }
    };

    let handleLike = async (post) => {
      const postId = post.id;
      console.log(postId)
      try {
        let alreadyLiked = JSON.parse(localStorage.getItem('likedPosts')) || [];
        if (alreadyLiked.includes(postId)) {
          // User has already liked this post
          return;
        }
    
        let response = await fetch(`${config.apiUrl}/posts/${postId}/like/`, {
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
        toast.error('You have already reported this post.');
        return;
      }

      try {
          let response = await fetch(`${config.apiUrl}/posts/${post.id}/report/`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${authTokens.access}`,
              },
          });

          if (response.status === 200) {
              toast.success('Post reported')
              getPosts(activePage); // Refresh posts after reporting
              
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
      console.log('Changing to page: ', newPage);
    
      if (!nextPage && newPage > activePage) {
        console.log("There's no next page.");
        console.log(prevPage)
        return;
      }
      setActivePage(newPage);
      getPosts(newPage);
    };
    
  
    
    useEffect(() => { 
        console.log(activePage)
        getTotalPosts();
        console.log(pageCount)
        getPosts(activePage);
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
                            src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${post.user.profile_picture || '/Desktop/default_user.jpg'}`}
                            alt={`${post.user.username}'s Profile`}
                          />
                          <span className="username">{post.user.username}</span>
                        </div>
                            <button className="report-button" onClick={() => handleReport(post)}>
                              <FontAwesomeIcon icon={faFlag} />
                            </button>
                      </div>
                      <div className='post-content'>
                        <img src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${post.image ? post.image : '/media/images/background.jpeg'}`} alt={post.post}  />
                      </div>
                      <div className='caption'>
                        <span><b>{post.user.username}</b> </span><span>{post.text ? post.text : 'No caption available'}</span>
                      </div>
                        <div className='actions'>
                        <button className='like-button' onClick={() => handleLike(post)}>
                        <FontAwesomeIcon icon={faHeart} />
                          {/* <span>{post.likes.length}</span> */}
                        </button> 
                        <button  className='commenting-button' onClick={() => handleComment(post)}>
                            <FontAwesomeIcon icon={faComment} className="comment-icon" />
                          </button>
                        </div>
                        <div className='likes'>
                          <span>Liked by {post.likes.length}</span>
                        </div>
                        <div>
                          <input 
                            className='homeInput'
                            type="text" 
                            placeholder="Add a comment" 
                            value={comments[post.id] || ''} 
                            onChange={(e) => 
                              setComments({ ...comments, [post.id]: e.target.value })
                            } 
                          />
                        {activePost && (
                            <PostWithComments
                              imageUrl={`${activePost.image}`}
                              caption={activePost.text}
                              comments={activePost.comments}
                              onClose={closeModal}
                              postId={activePost.id}
                              authTokens={authTokens}
                            />
                          )}
                          </div>
                        </li>
                      ))}
                  </ul>
                  </div>
                  <div className='pagination-container'>
                    <PaginationPosts activePage={activePage} pageCount={pageCount} onChange={handlePageChange} />
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


