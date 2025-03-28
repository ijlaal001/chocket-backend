// Backend (Node.js + Express + Socket.io)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Sample API Endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: "Data fetched successfully!", data: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }] });
});

// Real-time Chat Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('message', (msg) => { // ✅ Fix: Using "message" event
        io.emit('message', msg); // ✅ Broadcast to all clients
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
