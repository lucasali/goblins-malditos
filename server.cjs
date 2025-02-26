const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

// Serve static files from the dist directory if they exist
// This allows the server to serve the Vue app in production
app.use(express.static(path.join(__dirname, 'dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to your domain
    methods: ['GET', 'POST']
  }
});

// Store active rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Initialize room if it doesn't exist
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set(), diceState: [] });
    }
    
    // Add user to room
    const room = rooms.get(roomId);
    room.users.add(socket.id);
    
    // Send current dice state to the new user
    socket.emit('dice-state-update', room.diceState);
    
    // Notify others that a new user joined
    socket.to(roomId).emit('user-joined', socket.id);
  });

  // Handle dice roll
  socket.on('dice-roll', (data) => {
    const { roomId, diceState } = data;
    
    if (rooms.has(roomId)) {
      // Update room state
      const room = rooms.get(roomId);
      room.diceState = diceState;
      
      // Broadcast to all other clients in the room
      socket.to(roomId).emit('dice-state-update', diceState);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms they were in
    for (const [roomId, room] of rooms.entries()) {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        
        // If room is empty, remove it
        if (room.users.size === 0) {
          rooms.delete(roomId);
        } else {
          // Notify others that user left
          socket.to(roomId).emit('user-left', socket.id);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server is ready to accept connections`);
}); 
