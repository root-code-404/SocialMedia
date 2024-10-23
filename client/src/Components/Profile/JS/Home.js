import React from 'react'
import ProfileLeftbar from './Leftbar'
import ProfileRightbar from './Rightbar'
import "../CSS/home.css";
import Navbar from '../../Login/JS/Navbar';
import Post from './Post';
function Home() {
  return (
    <div>
      <div className='ProfileContainer'>
        <Navbar />
        <div className='subProfileContainer'>
          <ProfileLeftbar />
          <Post />
          <ProfileRightbar />
        </div>
      </div>
    </div>
  )
}

export default Home
