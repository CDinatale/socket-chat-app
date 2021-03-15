const http = require('http');
const express = require('express');
const socketio = require('socket.io');
var mongoose = require('mongoose');
const message = require("./message")
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage
} = require('./user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname));

const dbUrl = 'mongodb+srv://CoraD:lgVsMlCrE3bOwpIA@cluster0.jrba8.mongodb.net/labTest1?retryWrites=true&w=majority'

mongoose.connect(dbUrl , { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
  if (err) {
      console.log('mongodb connected.',err);
  }else{
      console.log('mongodb successfully connected.');
  }
})

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit('message', formatMessage(user.username, msg));
    message.saveChat({
      sender: user.username,
      room: user.room,
      msg
    });
  });

  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));