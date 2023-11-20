import React, { useEffect } from 'react';
import '../css/postwithcomments.css'; // Make sure to create this CSS file for styling

const PostWithComments = ({ imageUrl, caption, comments, onClose }) => {

  useEffect(() => {
    // When the modal is open
    document.body.style.overflow = 'hidden';
    // Re-enable scrolling when the modal is closed
    return () => (document.body.style.overflow = 'unset');
  }, []); // Run this effect when the component mounts

  return (
    <div className="post-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="image-section">
          <img src={imageUrl} alt="Post" />
        </div>
      <div className="comments-section">
        {/* <div className="caption7">
          <strong>Caption:</strong> {caption}
        </div> */}
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
                <img src={`http://localhost:8000${comment.user.profile_picture}`} alt={comment.user.username} className="comment-user-image"/>
              <div className='comment-text'>
                <strong>{comment.user.username}</strong> {comment.comment_text}
              </div>
            </div>
          ))}
        </div>
        <div className="comment-input">
          <input type="text" placeholder="Add a comment..."  /> 
          <button>Post</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PostWithComments;
