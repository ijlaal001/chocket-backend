const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

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

// Connect to MongoDB Atlas
const MONGO_URI = "mongodb+srv://ijlaal:0786@cluster0.s1uwbsj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Chat Message Schema
const chatSchema = new mongoose.Schema({
    sender: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model("ChatMessage", chatSchema);

// API to Get All Messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Real-time Chat Logic
io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id);

    // Send previous chat history
    try {
        const chatHistory = await ChatMessage.find().sort({ timestamp: 1 });
        socket.emit('chatHistory', chatHistory);
    } catch (err) {
        console.error("Error sending chat history:", err);
    }

    socket.on('chatMessage', async (msg) => {
        try {
            const newMessage = new ChatMessage(msg);
            await newMessage.save();  // Save message to database
            io.emit('chatMessage', newMessage);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
