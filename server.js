const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

app.use(cors());
app.use(express.json());

let chatHistory = [];

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send previous chat messages to the new user
    socket.emit("chatHistory", chatHistory);

    socket.on("message", (data) => {
        chatHistory.push(data);
        io.emit("message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Simple test route
app.get("/", (req, res) => {
    res.send("Chocket Backend Running!");
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});
