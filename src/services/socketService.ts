import { io as socketIO } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { ref } from 'vue';

// Interface for dice state
interface DiceItem {
  id: number;
  faces: number;
  result: number | null;
  selected: boolean;
}

class SocketService {
  private socket: Socket | null = null;
  private _isConnected = ref(false);
  private _roomId = ref<string | null>(null);
  private _connectedUsers = ref<string[]>([]);

  // Getters
  get isConnected() {
    return this._isConnected.value;
  }

  get roomId() {
    return this._roomId.value;
  }

  get connectedUsers() {
    return this._connectedUsers.value;
  }

  // Initialize socket connection
  init(serverUrl: string = 'http://localhost:3000') {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = socketIO(serverUrl);

    this.socket.on('connect', () => {
      console.log('Connected to server with ID:', this.socket?.id);
      this._isConnected.value = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this._isConnected.value = false;
      this._roomId.value = null;
      this._connectedUsers.value = [];
    });

    this.socket.on('user-joined', (userId: string) => {
      console.log('User joined:', userId);
      if (!this._connectedUsers.value.includes(userId)) {
        this._connectedUsers.value.push(userId);
      }
    });

    this.socket.on('user-left', (userId: string) => {
      console.log('User left:', userId);
      this._connectedUsers.value = this._connectedUsers.value.filter(id => id !== userId);
    });

    return this;
  }

  // Join a room
  joinRoom(roomId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('join-room', roomId);
    this._roomId.value = roomId;
    console.log('Joined room:', roomId);
  }

  // Send dice roll to server
  sendDiceRoll(diceState: DiceItem[]) {
    if (!this.socket || !this.isConnected || !this._roomId.value) {
      console.error('Socket not connected or not in a room');
      return;
    }

    this.socket.emit('dice-roll', {
      roomId: this._roomId.value,
      diceState
    });
  }

  // Subscribe to dice state updates
  onDiceStateUpdate(callback: (diceState: DiceItem[]) => void) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return () => {};
    }

    this.socket.on('dice-state-update', callback);
    
    // Return unsubscribe function
    return () => {
      this.socket?.off('dice-state-update', callback);
    };
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this._isConnected.value = false;
      this._roomId.value = null;
      this._connectedUsers.value = [];
    }
  }
}

// Create singleton instance
export const socketService = new SocketService(); 
