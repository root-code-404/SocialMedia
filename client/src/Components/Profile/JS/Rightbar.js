import React, { useState, useEffect } from 'react';
import "../CSS/rightbar.css";
import { Link } from 'react-router-dom';


export default function ProfileRightbar() {
  const [followers, setFollowers] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    fetch('/api/getFollowers')
      .then((response) => response.json())
      .then((data) => {
        setFollowers(data);
      })
      .catch((error) => console.error('Error:', error));
  }, [followers]);

  useEffect(() => {
    // Fetch users (excluding logged-in user)
    fetch('/api/getUsers')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className='Profilerightbar'>
      <div className='profilerightcontainer'>
        <h3 className='ms-2 mb-4'>Followers</h3>

        <div>
          {followers.length === 0 ? (
            <h4 className='ms-4'>No followers</h4>
          ) : (
            followers.map((follower) => (
              <div key={follower._id} style={{ marginTop: "10px" }} className=''>
                <Link to={`/profileuser/${follower._id}`} className="profile-link text-decoration-none text-black">
                  <div style={{ display: 'flex', alignItems: "center", marginLeft: 10, cursor: "pointer" }}>
                    <img src={follower.filePath} className="Friendsimage" alt="" />
                    <p style={{ textAlign: "start", marginLeft: "10px" }}>{follower.name}</p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <div className='rightcontainer2'>
        <h3 style={{ textAlign: "start", marginLeft: "10px" }} className='mb-4'>Suggested for you</h3>
        {users.slice().reverse().map(user => (
          <div key={user._id} style={{ marginTop: "10px" }}>
            <Link to={`/profileuser/${user._id}`} className="profile-link text-decoration-none text-black">
              <div style={{ display: 'flex', alignItems: "center", marginLeft: 10, cursor: "pointer" }}>
                <img src={user.filePath} className="Friendsimage" alt="" />
                <p style={{ textAlign: "start", marginLeft: "10px" }}>{user.name}</p>
              </div>
            </Link>
          </div>
        ))}

      </div>
    </div>
  );
}
