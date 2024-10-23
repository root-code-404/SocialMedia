import React, { useState, useEffect } from 'react';
import "../CSS/navbaradmin.css";
import { FaSearch, FaHome, } from 'react-icons/fa'; // Imported icons
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import Fuse from 'fuse.js';


export default function NavbarAdmin() {

  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    fetch('/api/searchUser')
      .then((response) => response.json())
      .then((data) => setUserList(data))
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  const options = {
    keys: ['name'],
    includeScore: true,
  };

  const handleSearch = (query) => {
    const fuse = new Fuse(userList, options);
    const result = fuse.search(query);
    const filteredUsers = result
      .map((item) => item.item)
      .slice(0, 3); // Limit to the first three users
    setFilteredUsers(filteredUsers);
  }

  const handleInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleBlur = () => {
    // If searchQuery is empty, reset filteredUsers to display all users
    if (!searchQuery.trim()) {
      const limitedUsers = userList.slice(0, 4);
      setFilteredUsers(limitedUsers);
    }
  }

  const handleLogout = async () => {
    const response = await fetch('/api/logout');
    const data = await response.json();

    if (data.success) {
      // Logout was successful, handle it here (e.g., redirect to login page)
      navigate('/login'); // Redirect to login page
    } else {
      // Handle unsuccessful logout (optional)
      console.error('Error logging out:', data.message);
    }
  };


  return (
    <div className='mainNavbar'>
      <div className='LogoContainer'>
        <p className='logoText'>Soc<span className='part'>ial</span></p>
      </div>
      <div>
        <div className='searchInputContainer'>
          <Dropdown className="searchDropdown">
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <FaSearch className="searchIcon" />
              <input
                type="text"
                className='searchInput'
                placeholder='search your friends'
                value={searchQuery}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </Dropdown.Toggle>
            {filteredUsers.length > 0 && (
              <Dropdown.Menu>
                {filteredUsers.map((user) => (
                  <Dropdown.Item style={{ width: "570px" }} key={user._id}>
                    <Link to={`/userprofiles/${user._id}`} className='text-decoration-none text-dark'>
                      <div key={user._id} className='d-flex align-items-center mb-2'>
                        <img
                          src={user.filePath}
                          alt='Profile'
                          className='PostImage me-2'
                          style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: "pointer" }}
                        />
                        <p style={{ margin: 0 }}>{user.name}</p>
                      </div>
                    </Link>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Dropdown>
        </div>
      </div>
      <div className='IconsContainer'>
        <p className='logoText'>Ad<span className='part'>min</span></p>

        <Link to="/userdetails" className='text-dark' data-toggle="tooltip" title="Home"><FaHome className="Icons" /></Link>
        {/* <Link to="/addfriend" className='text-dark' data-toggle="tooltip"  title="Add Friend"><FaUserPlus className="Icons" /> </Link>
        <Link to="/post" className='text-dark' data-toggle="tooltip"  title="Add Post"><FaPlus className="Icons" /></Link>
        <FaBell className="Icons"  />
        <FaEnvelope className="Icons" />
        <Link to="/profile"  className='text-dark' data-toggle="tooltip"  title="Profile"><FaUser className="Icons" /></Link> 
         */}

        <div style={{ marginRight: "30px", marginLeft: "40px", cursor: "pointer", marginTop: '10px' }}>
          <Link to="/login">
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
