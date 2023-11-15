import React from 'react';
import '../css/postwithcomments.css'; // Make sure to create this CSS file for styling

const PostWithComments = ({ imageUrl, caption, comments, onClose }) => {

    console.log(comments);
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
                <strong>{comment.user.username}</strong>: {comment.comment_text}
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
