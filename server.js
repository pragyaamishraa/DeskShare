const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Define the port
const port = process.env.PORT || 5000;

// Routes
app.post('/create-whiteboard', (req, res) => {
  console.log('Received create-whiteboard request');
  // Simulate creating a whiteboard
  const whiteboardData = { id: 1, title: 'New Whiteboard' };
  res.json({ success: true, whiteboardData });
});

app.patch('/update-whiteboard', (req, res) => {
  console.log('Update data:', req.body);
  res.json({ success: true });
});

app.get('/', (req, res) => {
  const data = { message: 'Hello! DeskShare backend is working' };
  console.log('Data sent from backend:', data);
  res.json(data);
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
    // Broadcast to other users in the room that a new user has joined
    socket.to(roomId).emit('userJoined');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Handle user disconnection and notify other users in the room
    io.emit('userLeft');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
