// App.js
import React from 'react';
import Navbar from "./Components/Login/JS/Navbar";
import NavbarAdmin from "./Components/Admin/JS/NavbarAdmin";
import Home from "./Components/Profile/JS/Home";
import Signup from "./Components/Login/JS/Signup";
import PostFile from "./Components/Profile/JS/PostFile";
import Login from "./Components/Login/JS/Login";
import UserProfile from "./Components/Profile/JS/UserProfile";
import UserHome from "./Components/Profile/JS/UserHome";
import AddFriend from "./Components/Profile/JS/AddFriend";
import ProfileUser from "./Components/User/JS/ProfileUser";
import ProfileUserImages from "./Components/User/JS/ProfileUserImages";
import ShareView from "./Components/Profile/JS/ShareView";


import UserTable from "./Components/Admin/JS/UserTable";
import UserProfiles from "./Components/Admin/JS/UserProfiles";
import UserImages from "./Components/Admin/JS/UserImages";


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="">
      <Router>
        <Routes>
          {/* Login and Signup routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Signup />} />
          <Route path="/post/:postId" element={<ShareView />} />

          {/* end of Login and Signup routes */}

          {/* Protected routes */}
          {isAuthenticated && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/post" element={<PostFile />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profilepost" element={<><Navbar /><UserHome /></>} />
              <Route path="/addfriend" element={<><Navbar /><AddFriend /></>} />
              <Route path="/profileuser/:userId" element={<><Navbar /><ProfileUser /></>} />
              <Route path="/profileUserImages/:userId" element={<><Navbar /><ProfileUserImages /></>} />
            </>
          )}

          {/* Admin routes */}
          {isAdmin && (
            <>
              <Route path="/userdetails" element={<><NavbarAdmin /><UserTable /></>} />
              <Route path="/userprofiles/:userId" element={<><NavbarAdmin /><UserProfiles /></>} />
              <Route path="/userimages/:userId" element={<><NavbarAdmin /><UserImages /></>} />
            </>
          )}

          {/* Redirect to login for unauthorized access */}
          {!isAuthenticated && <Route path="/*" element={<Navigate to="/login" />} />}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
