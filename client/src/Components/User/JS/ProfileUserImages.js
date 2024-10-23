import React, { useState, useEffect } from 'react';
import "../CSS/profileuserimages.css"
import { Modal } from 'react-bootstrap';
import { Heart, ChatDots, Share, HeartFill } from 'react-bootstrap-icons';

function ProfileUserImages() {
    const [user, setUser] = useState({
        filePath: '',
    });
    const [post, setPost] = useState([]);

    const [likedPosts, setLikedPosts] = useState([]);

    const [likedUsers, setLikedUsers] = useState([]);
    const [showLikedUsersModal, setShowLikedUsersModal] = useState(false);

    const [showCommentModal, setShowCommentModal] = useState(false);
    const [comment, setComment] = useState('');
    const [currentPostId, setCurrentPostId] = useState(null);

    const [comments, setComments] = useState([]);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const [fullScreenImageUrl, setFullScreenImageUrl] = useState('');



    useEffect(() => {
        const userId = window.location.pathname.split('/').pop();

        // Fetch user details and posts
        fetch(`/api/getUserDetailsAndPosts/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                setUser(data.user);
                setPost(data.posts);
            })
            .catch((error) => console.error('Error:', error));

        fetch('/api/getLikedPosts')
            .then((response) => response.json())
            .then((data) => {
                const likedPostIds = data.map((post) => post._id);
                setLikedPosts(likedPostIds);
            })
            .catch((error) => console.error('Error:', error));
    }, []);

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


            <Modal show={showLikedUsersModal} onHide={() => setShowLikedUsersModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Liked Users ({likedUsers.length})</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {likedUsers.map((user) => (
                        <div key={user._id} className='d-flex align-items-center mb-2'>
                            <img
                                src={user.filePath}
                                alt='Profile'
                                className='PostImage me-2'
                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                            />
                            <p style={{ margin: 0 }}>{user.name}</p>
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
                            <h5>Comments</h5>
                            {comments.map((comment) => (
                                <div key={comment._id} className="d-flex align-items-center mb-2">
                                    <img
                                        src={comment.profile}
                                        alt="Profile"
                                        className="PostImage me-2"
                                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                    />
                                    <div>
                                        <p style={{ margin: 0, fontSize: 15 }}>{comment.username}</p>
                                        <p style={{ margin: 0, fontSize: 10 }}>{comment.comment}</p>
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

export default ProfileUserImages;
