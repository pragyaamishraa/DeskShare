import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ENDPOINT = 'http://localhost:5000';

const EditDocument = () => {
  const { roomID } = useParams();
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard'); 
  };

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.emit('joinRoom', roomID);

    return () => {
      socket.disconnect();
    };
  }, [roomID]);

  useEffect(() => {
    if (socket) {
      socket.on('documentUpdated', (content) => {
        setText(content);
      });
    }
  }, [socket]);

  const handleChange = (content) => {
    setText(content);
    if (socket) {
      socket.emit('editDocument', { roomId: roomID, content });
    }
  };

  return (
    <div>
      <h2>Editing Room: {roomID}</h2>
      <ReactQuill
        theme="snow"
        value={text}
        onChange={handleChange}
        placeholder="Start typing here..."
        style={{ height: '500px' }}
      />

      <button
        className="absolute top-6 right-4 px-4 py-2 bg-gray-500 text-black rounded-md cursor-pointer z-10"
        onClick={handleBackToDashboard}
      >
        Back
      </button>
    </div>
  );
};

export default EditDocument;
