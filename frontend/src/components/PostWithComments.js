import React, { useState, useEffect, useContext } from 'react';
import '../css/postwithcomments.css';
import AuthContext from '../context/AuthContext';
import { config } from '../utils/env';
import { toast } from 'react-toastify';

const PostWithComments = ({ imageUrl, caption, comments, onClose, postId, authTokens }) => {
  const [newComment, setNewComment] = useState('');
  let { user } = useContext(AuthContext);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'unset');
  }, []);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const postComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    let response;

    try {
       response = await fetch(`${config.apiUrl}/posts/${postId}/comment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ post:postId, comment_text: newComment, user: user.id }) // Ensure you have the user's id available
      });

      if (response.status === 201) {
        toast.success("comment posted")
        // Handle success, e.g., clear the comment input, close the modal, refresh comments, etc.
        setNewComment('');
        onClose();
      } else {
        toast.error('failed');
        console.log(authTokens)
        throw new Error(response);
      }
    } catch (error) {
      console.error('Error posting comment:', response);
    }
  };

  return (
    <div className="post-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <button className="closed-button" onClick={onClose}>×</button>
        <div className="image-section">
          <img src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${imageUrl}`} alt="Post" />
        </div>
        <div className="comments-section">
          {/* <div className="caption7">
          <strong>Caption:</strong> {caption}
        </div> */}
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
                <img src={`${config.REACT_APP_MOMENTS_BUCKET_URL}${comment.user.profile_picture}`} alt={comment.user.username} className="comment-user-image"/>
              <div className='comment-text'>
                <strong>{comment.user.username}</strong> {comment.comment_text}
              </div>
            </div>
          ))}
        </div>
          <div className="comment-input">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={handleCommentChange}
            />
            <button onClick={postComment}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostWithComments;
