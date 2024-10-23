const express = require('express');
const http = require('http');
const helmet = require('helmet'); // Import Helmet

const connectDB = require('./config/db');
const session = require('express-session');
const path = require('path');

const registrationRoutes = require('./routes/registrationRoutes');
const { router: postRoutes, setupWebSocket } = require('./routes/postRoutes');

const app = express();
const server = http.createServer(app); // Create an HTTP server

// Set up socket.io
const io = require('socket.io')(server);

// Set up WebSocket
setupWebSocket(io);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Use Helmet middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using https
  })
);

// Routes
app.use('/api', registrationRoutes);
app.use('/api', postRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
