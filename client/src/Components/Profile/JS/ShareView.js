import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../CSS/userhome.css";



function ShareView() {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch post details based on postId
    fetch(`/api/getPostDetails/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data.post);
        setUser(data.user);
      })
      .catch((error) => console.error('Error:', error));
  }, [postId]);

  if (!post || !user) {
    // Loading state, you can render a loading spinner or message here
    return <div>Loading...</div>;
  }

  return (
    <div className='PostContainerss mt-4'>
      <div className='SubPostContainer' key={post._id}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={user.filePath} alt='Profile' className='PostImage me-2' style={{ cursor: "pointer" }} />
            <div>
              <p style={{ marginLeft: '5px', textAlign: 'start' }}>{user.name}</p>
              <p
                style={{
                  fontSize: '11px',
                  textAlign: 'start',
                  marginLeft: 5,
                  marginTop: -13,
                  color: '#aaa',
                }}>
                {post.date}
              </p>
            </div>
          </div>
          <p style={{ textAlign: 'start', width: '96%', marginLeft: 20, marginTop: 0 }}>
            {post.caption}
          </p>
          <img src={post.filePath} alt='Post' className='PostImages' style={{ cursor: "pointer" }} />
        </div>
      </div>

    </div>
  );
}

export default ShareView;
