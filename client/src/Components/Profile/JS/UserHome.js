import React, { useState, useEffect } from 'react';
import "../CSS/userhome.css";
import { Button, Modal, Form, Dropdown } from 'react-bootstrap';
import { Heart, ChatDots, Share, ThreeDotsVertical, HeartFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';


export default function UserHome() {
    const [user, setUser] = useState([]);
    const [post, setPost] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    const [likedUsers, setLikedUsers] = useState([]);
    const [showLikedUsersModal, setShowLikedUsersModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editedPost, setEditedPost] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comment, setComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);

    const [comments, setComments] = useState([]);

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
                console.log(data);
                setPost(data);
            })
            .catch((error) => console.error('Error:', error));

        fetch('/api/getLikedPosts')
            .then((response) => response.json())
            .then((data) => {
                const likedPostIds = data.map((post) => post._id);
                setLikedPosts(likedPostIds);
            })
            .catch((error) => console.error('Error:', error));
    }, [user]);

    const handleDelete = async (postId) => {
        try {
            const response = await fetch(`/api/postDelete/${postId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                console.log(`Post with ID ${postId} has been deleted.`);
            } else {
                console.error(`Error deleting post with ID ${postId}.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (posts) => {
        setEditedPost(posts);
        setEditingPostId(posts._id);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditedPost({});
        setEditingPostId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPost((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/postEdit/${editingPostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedPost),
            });

            const data = await response.json();

            if (data.success) {
                console.log(`Post with ID ${editingPostId} has been updated.`);
                setShowEditModal(false);
                setPost((prevPost) =>
                    prevPost.map((post) =>
                        post._id === editingPostId ? { ...post, ...editedPost } : post
                    )
                );
            } else {
                console.error(`Error editing post with ID ${editingPostId}.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // ... (previous code remains the same)

    const handleLike = async (postId) => {
        try {
            const response = await fetch(`/api/likePost/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ liked: !likedPosts.includes(postId) }),
            });

            const data = await response.json();
            if (data.success) {
                setLikedPosts((prevLikedPosts) =>
                    prevLikedPosts.includes(postId)
                        ? prevLikedPosts.filter((id) => id !== postId)
                        : [...prevLikedPosts, postId]
                );

                setPost((prevPost) =>
                    prevPost.map((post) =>
                        post._id === postId
                            ? { ...post, like: data.like }
                            : post
                    )
                );
            } else {
                console.error(`Error updating like status for post with ID ${postId}.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLikesClick = async (postId) => {
        try {
            setShowLikedUsersModal(true);

            const response = await fetch(`/api/getLikedUsers/${postId}`);
            const data = await response.json();

            setLikedUsers(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleComment = async () => {
        try {
            const response = await fetch(`/api/commentPost/${currentPostId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment }),
            });

            const data = await response.json();
            if (data.success) {
                setPost((prevPost) =>
                    prevPost.map((post) =>
                        post._id === currentPostId
                            ? { ...post, comments: [...post.comments, data.comment] }
                            : post
                    )
                );
                setShowCommentModal(false);
                setComment('');
            } else {
                console.error(`Error posting comment for post with ID ${currentPostId}.`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCommentsClick = async (postId) => {
        try {
            const response = await fetch(`/api/comments/${postId}`);
            const data = await response.json();

            setComments(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleFullScreen = (imageUrl) => {
        setIsFullScreen(!isFullScreen);
        setFullScreenImageUrl(imageUrl);
    };



    return (
        <div className='PostContainerss mt-4'>
            {post.slice().reverse().map((posts) => (
                <div className='SubPostContainer' key={posts._id}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={user.filePath} alt='Profile' className='PostImage me-2' onClick={() => toggleFullScreen(user.filePath)} style={{ cursor: "pointer" }} />
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
                                    {posts.date}
                                </p>
                            </div>
                            <div className='ms-auto'>
                                <Dropdown align='end'>
                                    <Dropdown.Toggle variant='none' id='dropdown-basic'>
                                        <ThreeDotsVertical />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href='#' onClick={() => handleEdit(posts)}>
                                            Edit
                                        </Dropdown.Item>
                                        <Dropdown.Item href='#' onClick={() => handleDelete(posts._id)}>
                                            Delete
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>
                        <p style={{ textAlign: 'start', width: '96%', marginLeft: 20, marginTop: 0 }}>
                            {posts.caption}
                        </p>
                        <img src={posts.filePath} alt='Post' className='PostImages' onClick={() => toggleFullScreen(posts.filePath)} style={{ cursor: "pointer" }} />
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                    {likedPosts.includes(posts._id) ? (
                                        <HeartFill className="me-2" onClick={() => handleLike(posts._id)} color='red' />
                                    ) : (
                                        <Heart className="me-2" onClick={() => handleLike(posts._id)} />
                                    )}
                                    <p
                                        style={{ marginLeft: '6px', marginTop: '15px', cursor: 'pointer' }}
                                        onClick={() => handleLikesClick(posts._id)}
                                    >
                                        {posts.like.length} Likes
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20, cursor: 'pointer' }}>
                                    <ChatDots className='me-2' onClick={() => handleCommentsClick(posts._id)} />
                                    <p
                                        style={{ marginLeft: '6px', marginTop: '15px', cursor: 'pointer' }}
                                        onClick={() => {
                                            setCurrentPostId(posts._id);
                                            setShowCommentModal(true);
                                            handleCommentsClick(posts._id)
                                        }}
                                    >
                                        {posts.comments.length} Comments
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 200, cursor: 'pointer' }}>
                                <Share className='me-2' />
                                <p style={{ marginLeft: '6px', marginTop: '15px' }}>Share</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId='formName'>
                            <Form.Label>Caption</Form.Label>
                            <Form.Control
                                as='textarea'
                                name='caption'
                                value={editedPost.caption || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={handleSaveEdit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showLikedUsersModal} onHide={() => setShowLikedUsersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Liked Users ({likedUsers.length})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {likedUsers.map((user) => (
                        <div key={user._id} className='d-flex align-items-center mb-2'>
                            <img
                                src={user.filePath} onClick={() => toggleFullScreen(user.filePath)}
                                alt='Profile'
                                className='PostImage me-2'
                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                            />
                            <Link to={`/profileuser/${user._id}`} className='text-decoration-none text-dark'><p style={{ margin: 0 }}>{user.name}</p></Link>
                        </div>
                    ))}
                </Modal.Body>
            </Modal>


            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post a Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Write a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={handleComment}>
                        Post
                    </button>
                </Modal.Footer>
                <div>
                    {/* ... (previous JSX remains the same) */}
                    {comments.length > 0 && (
                        <div className="mt-3">
                            <h5 className='ms-4 mb-4'> Comments</h5><hr />
                            {comments.map((comment) => (
                                <div key={comment._id} className="d-flex align-items-center mb-2">
                                    <img
                                        src={comment.profile} onClick={() => toggleFullScreen(comment.profile)}
                                        alt="Profile"
                                        className="PostImage me-2"
                                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                    />
                                    <div>
                                        <p style={{ margin: 1, fontSize: 18 }}>{comment.username}</p>
                                        <p style={{ margin: 1, fontSize: 11, backgroundColor: '#f1f2f2' }} className='ms-2 me-4'>{comment.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Modal>

            {isFullScreen && (
                <div className="full-screen-image" onClick={() => toggleFullScreen('')}>
                    <img src={fullScreenImageUrl} alt="Full Screen" />
                </div>
            )}

        </div>
    );
}
