const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect to Database
connectDB();

// Init Middleware
// This allows us to accept JSON data in the body
app.use(express.json());
// This allows your Next.js app to make requests to this backend
app.use(cors());


// Define Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/snippets', require('./routes/snippets'));
app.use('/api/categories', require('./routes/categories'))

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT} ✅`));