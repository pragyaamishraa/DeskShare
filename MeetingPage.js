import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import backgroundImage from '../images/welcomeBackground.jpg';
import Peer from 'peerjs';

const MeetingPage = () => {
  const { roomId } = useParams(); // Extract roomId from URL parameter
  const localVideoRef = useRef(null);
  const peerRef = useRef(null);
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const initWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        // Initialize peer connection with configuration
        const peer = new Peer(undefined, {
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' }, // Example STUN server
              // Add more ICE servers or consider using a TURN server if necessary
            ],
          },
        });

        peer.on('open', () => {
          // Peer connection established
          console.log('Connected to peer server with ID:', peer.id);
          peerRef.current = peer;

          // Initiate call to remote peer (room ID)
          console.log('Calling peer with roomId:', roomId);
          const call = peer.call(roomId, stream);

          call.on('stream', remoteStream => {
            // Display remote stream
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = remoteStream;
            remoteVideo.autoplay = true;
            document.getElementById('remote-video-container').appendChild(remoteVideo);
          });
        });

        peer.on('error', error => {
          console.error('Peer connection error:', error);
          // Handle specific errors as needed
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        // Handle media access errors gracefully
      }
    };

    initWebRTC();

    return () => {
      // Clean up peer connection when component unmounts
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId]);

  const handleLeaveMeeting = async () => {
    // Clean up and navigate back to dashboard
    if (peerRef.current) {
      // Destroy the peer connection
      peerRef.current.destroy();
    }
  
    try {
      // Turn off webcam and microphone
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      
      // Get all tracks
      const tracks = stream.getTracks();
  
      // Stop each track
      tracks.forEach(track => {
        track.stop();
      });
  
      // Release the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error stopping webcam/microphone:', error);
      // Handle cleanup errors if needed
    }
  
    // Revoke camera and microphone access
    try {
      await navigator.mediaDevices.getUserMedia({ video: false, audio: false });
    } catch (error) {
      console.error('Error revoking camera/microphone access:', error);
      // Handle media access revocation errors
    }
  
    // Navigate back to dashboard
    navigate('/dashboard');
  };

  const toggleFullScreen = () => {
    const videoContainer = document.getElementById('remote-video-container');
    if (videoContainer) {
      if (!isFullScreen) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen().catch(error => {
            console.error('Failed to enter fullscreen:', error);
          });
        }
      } else {
        if (document.exitFullscreen && document.fullscreenElement) {
          document.exitFullscreen().catch(error => {
            console.error('Failed to exit fullscreen:', error);
          });
        }
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 1 }}
      className="flex justify-center items-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div
        className={`bg-white bg-opacity-30 p-8 rounded-lg shadow-xl relative transform transition-all duration-500 scale-100 opacity-100 ${isFullScreen ? 'w-screen h-screen flex flex-col justify-center items-center' : 'w-full max-w-lg'}`}
        style={{ backdropFilter: 'blur(5px)', overflow: 'hidden' }}
        id="remote-video-container"
      >
        <h2 className="text-3xl font-semibold text-center text-purple-950 mb-6">Meeting Room</h2>
        <p className="text-lg text-gray-800 mb-8">
          Welcome to the virtual meeting room! Collaborate effectively with your team and discuss ideas.
        </p>
        <p className="text-xl text-purple-950 mb-4">Room ID: {roomId}</p>
        <video ref={localVideoRef} autoPlay muted className={`${isFullScreen ? 'h-screen' : 'w-full h-auto'}`} />
        {!isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="bg-purple-950 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 mt-4"
            style={{ width: '250px', display: 'block', margin: '0 auto' }}
          >
            Enter Fullscreen
          </button>
        )}
        <button
          onClick={handleLeaveMeeting}
          className="bg-purple-950 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 mt-4"
          style={{ width: '250px', display: 'block', margin: '0 auto', marginTop: '1rem' }}
        >
          Leave Meeting
        </button>
        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="bg-purple-950 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-110 mt-4"
            style={{ width: '250px', display: 'block', margin: '0 auto', marginTop: '1rem' }}
          >
            Exit Fullscreen
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MeetingPage;
