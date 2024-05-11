import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Info = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-300 to-gray-400"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 120 }}
        className="justify-center max-w-lg px-6 py-8 bg-white shadow-md rounded-md"
        style={{ background: 'linear-gradient(to right, #9BBBB6, #9BA7D0)' }}
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Info
        </h2>
        <p className="text-lg text-gray-600 mb-8">
        DeskShare is a web platform designed for collaborative brainstorming, project management, and real-time interaction. It offers core functionalities like a collaborative whiteboard for real-time drawing and brainstorming, a collaborative text editor for co-authoring documents, and video conferencing for visual communication and collaboration. Additionally, DeskShare features an AI assistant named "Saturn" that provides real-time problem-solving assistance, and pre-designed templates for whiteboards to kickstart brainstorming sessions. 
</p>
        <div className="flex justify-center">
          <Link to="/" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out" style={{ backgroundColor: '#3D2C45' }}>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Info;
