import React, { useState, useEffect } from 'react';
import "../CSS/leftbar.css";
import { Button, Modal, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export default function ProfileLeftbar() {

  const [user, setUser] = useState([]);

  const [following, setFollowing] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    bio: ''
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');


  useEffect(() => {
    fetch('/api/userInfo')
      .then((response) => response.json())
      .then((data) => setUser(data))
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

  useEffect(() => {
    fetch('/api/getFollowing')
      .then((response) => response.json())
      .then((data) => {
        setFollowing(data);
      })
      .catch((error) => console.error('Error:', error));
  }, [following]);

  const toggleFullScreen = (imageUrl) => {
    setIsFullScreen(!isFullScreen);
    setFullScreenImageUrl(imageUrl);
  };


  return (<>
    <div className='ProfileLeftbar'>
      <div className='NotificationsContainer'>


        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={user.filePath} className="Profilepageimage" alt="" onClick={() => toggleFullScreen(user.filePath)} style={{ cursor: "pointer" }} />
          <div>
            <p style={{ marginLeft: 6, marginTop: 30, color: "black", textAlign: 'start' }}>{user.name}</p>
            <p style={{ marginLeft: 6, marginTop: -10, color: "black", textAlign: "start", fontSize: 11 }}>{user.email}</p>
          </div>
        </div>

        {user.following !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Followings</p>
            <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 15 }}>{user.following.length}</p>
          </div>
        )}

        {user.following !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -20 }}>
            <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Followers</p>
            <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 17 }}>{user.followers.length}</p>
          </div>
        )}

        <div style={{ marginTop: -20 }}>
          <h5 style={{ color: "black", marginLeft: 10, fontSize: "14px", marginRight: 30, marginTop: 30, textAlign: "start" }}>User bio</h5><br />
          <p style={{ color: "black", fontSize: "12px", marginTop: -20, textAlign: "start", marginLeft: "10px" }}>{user.bio}</p>
        </div>

        <div>
          <button style={{ width: "90%", paddingTop: 7, paddingBottom: 7, border: "none", backgroundColor: "black", color: "white", borderRadius: 20 }} className='ms-3' onClick={() => setShowModal(true)}>Edit</button>
        </div>
      </div>

      <div className='NotificationsContainer'>
        <h3 className='ms-2 mt-1'>Followings</h3>
        <div style={{ display: "flex", justifyContent: 'space-between' }}>
          <p style={{ marginLeft: 10 }}>Friends</p>
          <p style={{ marginRight: 10, color: "#aaa" }}>See all</p>
        </div>

        <div>
          {following.length === 0 ? (
            <h4 className='ms-4'>No following</h4>
          ) : (
            following.map((following) => (
              <div key={following._id} style={{ marginTop: "10px" }} className=''>
                <Link to={`/profileuser/${following._id}`} className="profile-link text-decoration-none text-black">
                  <div style={{ display: 'flex', alignItems: "center", marginLeft: 10, cursor: "pointer" }}>
                    <img src={following.filePath} className="Friendsimage" alt="" />
                    <p style={{ textAlign: "start", marginLeft: "10px" }}>{following.name}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    {isFullScreen && (
      <div className="full-screen-image" onClick={() => toggleFullScreen('')}>
        <img src={fullScreenImageUrl} alt="Full Screen" />
      </div>
    )}

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
    </Modal></>
  );
}
