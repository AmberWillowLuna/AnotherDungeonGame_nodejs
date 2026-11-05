const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const MainMap = require('./public/mainMap.js'); // server-side only (CommonJS)

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const GRID_SIZE = 25;
const players = {};            // { socketId: { name, color, pos } }
const mainMap = new MainMap(); // the public lobby

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Give the new browser the map + everybody who is already here
  socket.emit('init', { map: mainMap.getMap(), players, id: socket.id });

  // Player picked name + color
  socket.on('newPlayer', ({ name, color }) => {
    players[socket.id] = {
      name: String(name).slice(0, 16),
      color,
      pos: [12, 12], // spawn in the middle
    };
    console.log('Joined:', players[socket.id]); // debug
    io.emit('updatePlayers', players);
  });

  // Player moved one tile
  socket.on('move', ({ x, y }) => {
    const p = players[socket.id];
    if (!p) return; // hasn't joined yet

    // Basic validation: inside the grid, max 1 tile away
    const inside = Number.isInteger(x) && Number.isInteger(y) &&
                   x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE;
    const oneStep = Math.abs(x - p.pos[0]) + Math.abs(y - p.pos[1]) <= 1;
    if (!inside || !oneStep) {
      console.log('Move rejected:', { x, y }, 'current:', p.pos); // debug
      return;
    }

    p.pos = [x, y];
    io.emit('updatePlayers', players);
  });

  // Chat (only for players who joined)
  socket.on('chatMessage', ({ message }) => {
    const p = players[socket.id];
    if (!p) return;
    io.emit('chatMessage', { name: p.name, message: String(message).slice(0, 200) });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));