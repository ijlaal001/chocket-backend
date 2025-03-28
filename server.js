// Backend (Node.js + Express + Socket.io + MongoDB)
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express App
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

// MongoDB Connection
const mongoURI = "mongodb+srv://ijlaal:0786@cluster0.s1uwbsj.mongodb.net/chatapp?retryWrites=true&w=majority";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Message Schema & Model
const chatSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatSchema);

// API Endpoint to Fetch Messages (Optional)
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Real-time Chat Logic
io.on('connection', async (socket) => {
    console.log('🔗 A user connected:', socket.id);

    try {
        // Send chat history when user connects
        const messages = await ChatMessage.find().sort({ timestamp: 1 });
        socket.emit('chatHistory', messages);
    } catch (err) {
        console.error('Error sending chat history:', err);
    }

    socket.on('chatMessage', async (msg) => {
        const chatMsg = new ChatMessage(msg);
        await chatMsg.save();
        io.emit('chatMessage', msg); // Broadcast to all users
    });

    socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
