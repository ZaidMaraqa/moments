const handleReport = async (post, authTokens, reportedPosts, setReportedPosts, getPosts) => {
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
            getPosts(); // Refresh posts after reporting
            alert(data.message);
            
            let updatedReportedPosts = [...reportedPosts, post.id];
            setReportedPosts(updatedReportedPosts);
            localStorage.setItem('reportedPosts', JSON.stringify(updatedReportedPosts));

        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        console.log(error);
    }
  };


  const handleComment = async (postId, setComment, commentText, authTokens, getPosts, user) => {
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

const handleLike = async (post, posts, authTokens, setPosts) => {
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
};

export const HomePageFunctions = {
  handleLike,
  handleComment,
  handleReport,
};
