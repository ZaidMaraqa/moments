import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../css/deletebutton.css';

const DeleteButton = ({ postId, authTokens }) => {

  const [isLoading, setIsLoading] = useState(false);
  
  
  const deletePost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      
      if (response.ok) {
        toast.success('Post successfully deleted.');
        setIsLoading(false)
      } else {

        setIsLoading(false)
        throw new Error('Error deleting the post');
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error:', error);
    }
  };

  return (
    <button
    className={`delete-button`}
      style={{ cursor: 'pointer' }}
      onClick={deletePost}
    >
      <span className="material-symbols-outlined">delete</span>
      <span></span>
      <span>{isLoading ? "Deleting" : "Delete Moment"}</span>
    </button>
  );
};

export default DeleteButton;
