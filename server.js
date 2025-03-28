const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to Chocket Backend");
});

// API Endpoint
app.get('/api/data', (req, res) => {
    res.json({
        message: "Data fetched successfully!",
        data: [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" }
        ]
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
