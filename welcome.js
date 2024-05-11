import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import logo from '../images/logo.png';
import background from '../images/welcomeBackground.jpg';
import { auth } from '../firebase';

const Welcome = () => {
  const location = useLocation();

  const userString = location.state?.user;
  let user = null;

  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token'); // Remove token from local storage
      localStorage.removeItem('user'); // Remove user from local storage
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle any potential errors during sign-out
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 1 }}
        className="flex justify-center items-center h-screen"
        style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          initial={{ scale: 0.8, x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 200, opacity: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 0.2, y: [0, -10, 0], transition: { yoyo: Infinity, duration: 0.9 } }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.1 }}
          transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 120 }}
          className="justify-center max-w-lg px-6 py-8 bg-white shadow-md rounded-md"
          style={{ background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(5px)' }}
        >
          <h2 className="text-3xl font-semibold text-center text-purple-950 mb-6">
            Welcome, {user?.displayName ?? 'User'} 👋
          </h2>
          <p className="text-lg text-gray-800 mb-8">
            Welcome to the nexus of virtual collaboration – where minds converge, ideas flourish, and colleagues from across
            the globe unite to innovate and create together.
          </p>
          <div className="flex justify-center">
            <Link
              to="/dashboard"
              className="bg-purple-950 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110"
              style={{ width: '250px', display: 'inline-block', textAlign: 'center' }}
            >
              Start Exploring
            </Link>
            <button
              onClick={handleLogout}
              className="bg-purple-950 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 ml-4"
              style={{ width: '250px', display: 'inline-block', textAlign: 'center' }}
            >
              Logout
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Welcome;
