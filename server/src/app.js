// project: ST-Inventory
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is 1 running...');
});
app.get('/test', (req, res) => {
    res.json({ message: 'API is running...' });
});


// 5. ตั้งค่า Port และเริ่มรัน Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});