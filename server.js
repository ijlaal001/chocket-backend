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

const chatHistory = []; // ✅ Store chat history

// Sample API Endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: "Data fetched successfully!", data: [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }] });
});

// Real-time Chat Logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // ✅ Send chat history to newly connected user
    socket.emit('chatHistory', chatHistory);

    socket.on('message', (msg) => {
        chatHistory.push(msg); // ✅ Store messages
        io.emit('message', msg); // ✅ Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
