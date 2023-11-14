import React from 'react';
import '../css/postwithcomments.css'; // Make sure to create this CSS file for styling

const PostWithComments = ({ imageUrl, caption, comments, onClose }) => {
  return (
    <div className="post-modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="image-section">
          <img src={imageUrl} alt="Post" />
        </div>
      <div className="comments-section">
        <div className="caption7">
          <strong>Caption:</strong> {caption}
        </div>
        <div className="comments-container">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <strong>{comment.username}</strong>: {comment.text}
            </div>
          ))}
        </div>
        <div className="comment-input">
          <input type="text" placeholder="Add a comment..." />
          <button>Post</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default PostWithComments;
