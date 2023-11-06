import React from 'react';

const DeleteButton = ({ postId, authTokens, refreshPosts }) => {
  const deletePost = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/posts/${postId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authTokens.access}`,
        },
      });
      
      if (response.ok) {
        refreshPosts(); // Refresh posts after deletion
        console.log('Post successfully deleted.');
      } else {
        throw new Error('Error deleting the post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      className="fas fa-trash"
      style={{ cursor: 'pointer' }}
      onClick={deletePost}
    >
      <span className="material-symbols-outlined">delete</span>
    </button>
  );
};

export default DeleteButton;
