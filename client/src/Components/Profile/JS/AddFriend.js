import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import "../CSS/addfriend.css";
import { Link } from 'react-router-dom';



function AddFriend() {
  const [users, setUsers] = useState([]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');

  useEffect(() => {
    // Fetch users (excluding logged-in user)
    fetch('/api/getFollow')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  }, []);


  const handleFollow = (userToFollowEmail) => {
    // Assuming you have the logged-in user's email stored in a variable `loggedInUserEmail`

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
          // Update UI to reflect the follow action
          // For example, change the "Follow" button text to "Following"
          setUsers(prevUsers => prevUsers.map(user => {
            if (user.email === userToFollowEmail) {
              return {
                ...user,
                isFollowing: true
              };
            }
            return user;
          }));
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
          setUsers(prevUsers => prevUsers.map(user => {
            if (user.email === userToUnfollowEmail) {
              return {
                ...user,
                isFollowing: false
              };
            }
            return user;
          }));
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
    <div className='PostContainers'>
      <Container className=''>
        <Row className="mt-4 mb-4">
          <Col md={8}>
            <div className="people-nearby">
              <h3 className='mb-4'>Follow User</h3>

              {users.slice().reverse().map(user => (
                <div className="nearby-user" key={user._id}>
                  <Row>
                    <Col md={2} sm={2}>
                      <img src={user.filePath} alt="user" className="profile-photo-lg" onClick={() => toggleFullScreen(user.filePath)} style={{ cursor: "pointer" }} />
                    </Col>
                    <Col md={7} sm={7}>
                      <h5><Link to={`/profileuser/${user._id}`} className="text-decoration-none ">{user.name}</Link>
                      </h5>
                      {/* <p>{user.profession}</p> */}
                      <p className="text-muted">{user.email} </p>
                    </Col>
                    <Col md={3} sm={3}>
                      <Button
                        variant={user.isFollowing ? "success" : "primary"}
                        className="pull-right col-12"
                        onClick={() => user.isFollowing ? handleUnfollow(user.email) : handleFollow(user.email)}
                      >
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </Button>

                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {isFullScreen && (
        <div className="full-screen-image" onClick={() => toggleFullScreen('')}>
          <img src={fullScreenImageUrl} alt="Full Screen" />
        </div>
      )}

    </div>
  )
}

export default AddFriend

