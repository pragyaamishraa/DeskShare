import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth, provider } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import logo from '../images/logo.png';

const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return; // Stop the function from proceeding further
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/welcome', { state: { user: JSON.stringify(user) } });
    } catch (error) {
      console.error('Firebase Error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in or use another email.');
      } else if (error.code === 'auth/weak-password') {
        setError('Weak Password. Password should be at least 6 characters.');
      } else {
        setError(error.message);
      }
    }
  };
  

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User data:', user);
      // Navigate to the welcome page or any other destination after successful sign-in
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
      <h2 className="text-5xl font-semibold mb-4">Create an account</h2>
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
        onClick={handleEmailPasswordSignIn}
        className="bg-transparent border border-transparent text-gray-500 hover:text-gray-800 shadow-md hover:shadow-lg hover:border-gray-400 hover:border-b-4 hover:border-opacity-50 px-4 py-2 rounded-md mb-4 transition-all duration-300"
        style={{ width: '30%', height: '50px' }}
      >
        Continue
      </button>
      <p className="mt-2">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500">
          Log in here
        </Link>
      </p>
      <br />
      <p className="text-gray-500 mb-4">--------------------------- OR ----------------------------</p>
      <br />
      <button
        onClick={handleGoogleSignIn}
        className="bg-transparent border border-transparent text-gray-500 hover:text-gray-800 shadow-md hover:shadow-lg hover:border-gray-400 hover:border-b-4 hover:border-opacity-50 px-4 py-2 rounded-md mb-4 transition-all duration-300 flex items-center"
        style={{ width: '30%', height: '50px' }}
      >
        <FontAwesomeIcon icon={faGoogle} className="mr-4" /> Continue with Google
      </button>
    </motion.div>
  );
}

export default SignInPage;