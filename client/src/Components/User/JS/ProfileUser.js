import React, { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import "../CSS/profileuser.css";


function ProfileUser() {
  const [user, setUser] = useState({
    filePath: '', // Add other properties as needed
  });
  const [post, setPost] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');

  useEffect(() => {
    const userId = window.location.pathname.split('/').pop();
    fetch(`/api/getUserProfile/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
        setIsFollowing(data.isFollowing);
      })
      .catch((error) => console.error('Error:', error));

    fetch(`/api/getUserPost/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => console.error('Error:', error));
  }, [user]);

  const handleFollow = (userToFollowEmail) => {
    fetch('/api/followUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userToFollowEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsFollowing(true);
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const handleUnfollow = (userToUnfollowEmail) => {
    fetch('/api/unfollowUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userToUnfollowEmail }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setIsFollowing(false);
        } else {
          console.error(data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const toggleFullScreen = (imageUrl) => {
    setIsFullScreen(!isFullScreen);
    setFullScreenImageUrl(imageUrl);
  };

  return (
    <div>
      <div className="PostContainersa">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="9" xl="7">
              <MDBCard>
                <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                  <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                    {user.filePath && (
                      <MDBCardImage src={user.filePath} alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1', cursor: "pointer" }} onClick={() => toggleFullScreen(user.filePath)} />
                    )}
                  </div>
                  <div className="ms-3" style={{ marginTop: '130px' }}>
                    <MDBTypography tag="h5">{user.name}</MDBTypography>
                    <MDBCardText>New York</MDBCardText>
                  </div>
                </div>
                <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                  <div className="d-flex justify-content-end text-center py-1">
                    <div>
                      <MDBCardText className="mb-1 h5">{post.length}</MDBCardText>
                      <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                    </div>
                    <div className="px-3">
                      {user.followers !== undefined && (
                        <>
                          <MDBCardText className="mb-1 h5">{user.followers.length}</MDBCardText>
                          <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                        </>
                      )}
                    </div>
                    <div>
                      {user.following !== undefined && (
                        <>
                          <MDBCardText className="mb-1 h5">{user.following.length}</MDBCardText>
                          <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                        </>
                      )}
                    </div>
                  </div>
                </div><br />
                <Button
                  className='col-4 ms-4'
                  variant={isFollowing ? "success" : "primary"}
                  onClick={() => isFollowing ? handleUnfollow(user.email) : handleFollow(user.email)}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <MDBCardBody className="text-black p-4">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1 mt-4">About</p>
                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                      <MDBCardText className="font-italic mb-1">{user.bio}</MDBCardText>

                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                    <Link to={`/profileUserImages/${user._id}`} className='text-muted'>
                      <MDBCardText className="mb-0">Show all</MDBCardText>
                    </Link>

                  </div>
                  <MDBRow>
                    {post.slice().reverse().map((posts, index) => (
                      <MDBCol key={index} className="mb-2 col-6 mt-2">
                        <MDBCardImage src={posts.filePath} alt={`image ${index + 1}`} className="rounded-3" style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: "pointer" }} onClick={() => toggleFullScreen(posts.filePath)} />
                      </MDBCol>
                    ))}
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      {isFullScreen && (
        <div className="full-screen-image" onClick={() => toggleFullScreen('')}>
          <img src={fullScreenImageUrl} alt="Full Screen" />
        </div>
      )}
    </div>
  )
}

export default ProfileUser;
