import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Connections from './pages/Connections';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import MainLayout from './components/MainLayout';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/discover" 
          element={
            <PrivateRoute>
              <Discover />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/connections" 
          element={
            <PrivateRoute>
              <Connections />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/messages"  
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
