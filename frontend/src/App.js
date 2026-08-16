import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Profile from './Profile';
import FollowPage from './FollowPage';
import ProfileRedirect from './ProfileRedirect';
import ProfilePage from './ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/follow" element={<FollowPage />} />
        <Route path="/profile" element={<ProfileRedirect />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App; 