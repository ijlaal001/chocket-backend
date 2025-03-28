const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let chatHistory = []; // Store messages in memory

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Send chat history to the newly connected client
    socket.emit("chatHistory", chatHistory);

    // Receive messages from clients
    socket.on("chatMessage", (msg) => {
        chatHistory.push(msg); // Store messages
        io.emit("chatMessage", msg); // Broadcast message to all clients
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
