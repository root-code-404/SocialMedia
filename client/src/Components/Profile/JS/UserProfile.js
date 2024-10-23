import React, { useState, useEffect } from 'react';
import "../CSS/userprofile.css";
import { Link } from 'react-router-dom';
import { Button, Modal, Form, Row } from 'react-bootstrap';
import Navbar from '../../Login/JS/Navbar';

import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';

export default function UserProfile() {

  const [user, setUser] = useState([]);
  const [post, setPost] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    bio: ''
  });

  const [followers, setFollowers] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const [following, setFollowing] = useState([]);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');

  useEffect(() => {
    fetch('/api/userInfo')
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error('Error:', error));

    fetch('/api/getPost')
      .then((response) => response.json())
      .then((data) => {
        setPost(data);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  useEffect(() => {
    setFormData({
      name: user.name || '',
      number: user.number || '',
      bio: user.bio || ''
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('/api/updateProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update user state with the new data
          setUser(prevUser => ({
            ...prevUser,
            name: formData.name,
            number: formData.number,
            bio: formData.bio,
          }));

          setShowModal(false); // Close the modal after successful update
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleShowFollowers = () => {
    fetch('/api/getFollowers')
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data);
        setShowFollowersModal(true);
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleShowFollowing = () => {
    fetch('/api/getFollowing')
      .then((response) => response.json())
      .then((data) => {
        setFollowing(data);
        setShowFollowingModal(true);
      })
      .catch((error) => console.error('Error:', error));
  };

  const toggleFullScreen = (imageUrl) => {
    setIsFullScreen(!isFullScreen);
    setFullScreenImageUrl(imageUrl);
  };




  return (<><Navbar />
    <div className=" PostContainersa "      >
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage src={user.filePath} onClick={() => toggleFullScreen(user.filePath)}
                    alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1', cursor: "pointer" }} />


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
                  <div className="ms-4" onClick={handleShowFollowers} style={{ cursor: "pointer" }}>
                    {user.followers !== undefined && (
                      <>
                        <MDBCardText className="mb-1 h5">{user.followers.length}</MDBCardText>
                        <MDBCardText className="small text-muted mb-0" >Followers</MDBCardText>
                      </>
                    )}
                  </div>
                  <div className="ms-4" onClick={handleShowFollowing} style={{ cursor: "pointer" }}>
                    {user.following !== undefined && (
                      <>
                        <MDBCardText className="mb-1 h5" >{user.following.length}</MDBCardText>
                        <MDBCardText className="small text-muted mb-0" >Following</MDBCardText>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button className='ms-4 mt-4 col-4 ' variant="dark" onClick={() => setShowModal(true)}>
                Edit profile
              </Button>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1 mt-2">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    {user.bio ? (
                      <MDBCardText className="font-italic mb-1">{user.bio}</MDBCardText>
                    ) : (
                      <p>No bio available</p>
                    )}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">Recent photos</MDBCardText>
                  {post.length > 0 ? (
                    <MDBCardText className="mb-0"><Link to="/profilepost" className='text-dark text-decoration-none'>Show all</Link></MDBCardText>
                  ) : (
                    <p>Show all</p>
                  )}
                </div>

                {post.length > 0 ? (
                  <MDBRow>
                    {post.slice().reverse().map((posts, index) => (
                      <MDBCol key={index} className="mb-2 col-6 mt-2">
                        <MDBCardImage
                          src={posts.filePath}
                          alt={`image ${index + 1}`}
                          className={" rounded-3 "}
                          style={{ width: '100%', height: '300px', objectFit: 'cover', cursor: "pointer" }}
                          onClick={() => toggleFullScreen(posts.filePath)}
                        />
                      </MDBCol>
                    ))}
                  </MDBRow>
                ) : (
                  <p>No posts available</p>
                )}

                {isFullScreen && (
                  <div className="full-screen-image" onClick={() => toggleFullScreen('')}>
                    <img src={fullScreenImageUrl} alt="Full Screen" />
                  </div>
                )}

              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Modal for editing user details */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group >
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group>
                <Form.Label>number</Form.Label>
                <Form.Control
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group >
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showFollowersModal} onHide={() => setShowFollowersModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Followers ({followers.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {followers.map((follower) => (
            <div key={follower._id} className='d-flex align-items-center mb-4'>
              <img
                src={follower.filePath}
                alt='Profile'
                className='PostImage me-2'
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <Link to={`/profileuser/${follower._id}`} className='text-decoration-none text-dark'><p style={{ margin: 0 }}>{follower.name}</p></Link>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      <Modal show={showFollowingModal} onHide={() => setShowFollowingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Following ({following.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {following.map((following) => (
            <div key={following._id} className='d-flex align-items-center mb-4'>

              <img
                src={following.filePath}
                alt='Profile'
                className='PostImage me-2'
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <Link to={`/profileuser/${following._id}`} className='text-decoration-none text-dark'><p style={{ margin: 0 }}>{following.name}</p></Link>

            </div>
          ))}
        </Modal.Body>
      </Modal>



    </div></>
  );
} 