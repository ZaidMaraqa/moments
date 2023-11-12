import React, { useState, useEffect } from 'react';
import PostImage from './PostImage'; // Component showing the image
import PostDetails from './PostDetails'; // Component showing the post details and comments
import './InstagramLayout.css'; // Your custom CSS file

const PostDetails = ({ postId }) => {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    // Fetch post data from API and set it in state
    // This is where you'd make a call to your backend service to get the post details
    // For the example, we're using static data
    const fetchData = async () => {
      // Replace with your actual API call
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();
      setPostData(data);
    };

    fetchData();
  }, [postId]);

  return (
    <div className="instagram-layout">
      {postData && (
        <>
          <PostImage imageUrl={postData.imageUrl} />
          <PostDetails 
            username={postData.username}
            caption={postData.caption}
            comments={postData.comments}
          />
        </>
      )}
    </div>
  );
};

export default PostDetails;
