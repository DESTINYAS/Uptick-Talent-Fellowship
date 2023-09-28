const dotenv = require("dotenv");
dotenv.config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const chatRoomRoutes = require('./routes/chatRoom');
const messageRoutes = require('./routes/message');
const authRoutes = require('./routes/auth');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// WebSocket server
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', (chatRoomId) => {
        socket.join(chatRoomId);
    });

    socket.on('sendMessage', ({ chatRoomId, message }) => {
        // Save the message to the database (using Mongoose, if needed)

        // Broadcast the message to all members of the chat room
        socket.to(chatRoomId).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const swaggerSpec = require('./swagger'); // Path to your Swagger configuration file
const swaggerUi = require('swagger-ui-express');

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use( authRoutes);
app.use(chatRoomRoutes);
app.use( messageRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

    
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  
  mongoose
    .connect(process.env.MONGODB_URI)
    .then((result) => {
      app.listen(port, function () {
        console.log("server started successfully");
      });
    })
    .catch((err) => {
      console.log(err);
    });