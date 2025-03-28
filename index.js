const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (email === "test@example.com" && password === "password") {
        return res.json({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
