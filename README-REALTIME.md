# Real-Time Dice Rolling Feature

This feature allows multiple users to share dice rolls in real-time across different browsers. When one user rolls dice, the same dice and results will appear on all connected browsers in the same room.

## How It Works

The real-time communication is implemented using Socket.IO, which provides WebSocket-based communication between clients through a central server.

### Technical Implementation

1. **Server**: A Node.js server using Express and Socket.IO handles the WebSocket connections and room management.
2. **Client**: The Vue.js application connects to the server using the Socket.IO client library.
3. **Rooms**: Users can create or join rooms using a room ID, allowing them to share dice rolls only with others in the same room.

## How to Use

### Starting the Server

Before using the real-time feature, you need to start the WebSocket server:

```bash
# Install dependencies (if not already done)
npm install

# Start the server
npm run server
```

The server will run on port 3000 by default.

### Using the Feature in the Browser

1. **Connect to a Room**:
   - Click the "Conectar" button in the dice roller component
   - Enter a room ID or click "Gerar ID" to generate a random one
   - Click "Conectar à Sala" to join the room

2. **Share the Room ID**:
   - Send the room ID to your friends so they can join the same room
   - They should enter the same room ID and connect

3. **Roll Dice**:
   - Once connected, any dice rolls you make will be sent to all other users in the same room
   - When others roll dice, you'll see their rolls appear on your screen

4. **Disconnect**:
   - Click "Desconectar" to leave the room

## Troubleshooting

- **Connection Issues**: Make sure the server is running and accessible
- **Dice Not Appearing**: Verify that all users are connected to the same room ID
- **Server Not Starting**: Check for any error messages in the console

## Security Considerations

- The current implementation allows any origin to connect to the server
- In a production environment, you should restrict the CORS settings to only allow connections from trusted domains
- Room IDs are not secured, so anyone with the ID can join the room

## Future Improvements

- Add user authentication
- Implement private rooms with passwords
- Add user nicknames to identify who rolled the dice
- Add chat functionality for room participants 
