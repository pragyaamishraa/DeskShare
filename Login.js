import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import logo from '../images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return; // Stop the function from proceeding further
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User data:', user);
      navigate('/welcome', { state: { user: JSON.stringify(user) } });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/invalid-credential') {
        setError('The credentials you entered do not match. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No user associated with this email. Please sign up.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else {
        setError(error.message);
      }
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User data:', user);
      navigate('/welcome', { state: { user: JSON.stringify(user) } });
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center h-screen"
    >
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
          className="h-20 w-auto mb-4 animate-bounce"
        />
      </Link>
      
      <h2 className="text-5xl font-semibold mb-4">Log in</h2>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md"
          style={{ width: '380px' }}
          required
        />
      </div>
      <div className="mb-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md"
          style={{ width: '380px' }}
          required
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleEmailPasswordLogin}
        className="bg-transparent border border-transparent text-gray-500 hover:text-gray-800 shadow-md hover:shadow-lg hover:border-gray-400 hover:border-b-4 hover:border-opacity-50 px-4 py-2 rounded-md mb-4 transition-all duration-300"
        style={{ width: '30%', height: '50px' }}
      >
        Log in
      </button>
      <p className="mt-2">
        Don't have an account?{' '}
        <Link to="/signin" className="text-blue-500">
          Sign up here
        </Link>
      </p>
      <br />
      <p className="text-gray-500 mb-4">--------------------------- OR ----------------------------</p>
      <br />
      <button
        onClick={handleGoogleLogin}
        className="bg-transparent border border-transparent text-gray-500 hover:text-gray-800 shadow-md hover:shadow-lg hover:border-gray-400 hover:border-b-4 hover:border-opacity-50 px-4 py-2 rounded-md mb-4 transition-all duration-300 flex items-center"
        style={{ width: '30%', height: '50px' }}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-4" /> Log in with Google
      </button>
    </motion.div>
  );
}

export default Login;