const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Allow both frontend URLs for CORS
app.use(cors({
    origin: ["https://chocket-frontend.onrender.com", "https://chocket-wzuf.onrender.com"],
    methods: ["GET", "POST"]
}));

// Initialize Socket.IO with proper CORS configuration
const io = new Server(server, {
    cors: {
        origin: ["https://chocket-frontend.onrender.com", "https://chocket-wzuf.onrender.com"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("message", (data) => {
        io.emit("message", data); // Broadcast message to all users
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
