import Player from './player.js';

const socket = io(); // "io" comes from /socket.io/socket.io.js

const GRID_SIZE = 25;

// number in the map -> cell color. Add new tiles here!
const TILE_COLORS = {
  0: 'white',
  17: 'lightgreen',
  18: 'lightgreen',
  19: 'lightgreen',
  20: 'lightgreen',
  21: 'green',
  22: 'green',
  23: 'green',
  24: 'green',
  25: 'green',
  26: 'green',
  27: 'green',
  28: 'green',
};

// --- HTML elements ---
const gridContainer = document.getElementById('grid');
const chatBox = document.getElementById('chat');
const playerForm = document.getElementById('playerForm');
const nicknameInput = document.getElementById('nickname');
const colorInput = document.getElementById('color');
const joinBtn = document.getElementById('joinBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

// --- State ---
let map = null;          // 25x25 array, sent by the server
let players = {};        // everybody online, sent by the server
let localPlayer = null;  // null until the user joins

// --- Drawing ---
function generateGrid() {
  gridContainer.innerHTML = '';
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.style.backgroundColor = TILE_COLORS[map[row][col]] || 'white';
      gridContainer.appendChild(cell);
    }
  }
}

function renderPlayers() {
  document.querySelectorAll('.player').forEach(el => el.remove());
  Object.values(players).forEach((player) => {
    const [x, y] = player.pos;
    const cell = gridContainer.children[y * GRID_SIZE + x];
    if (!cell) return;
    const dot = document.createElement('div');
    dot.className = 'player';
    dot.textContent = player.name[0];
    dot.style.backgroundColor = `rgb(${player.color.join(',')})`;
    cell.appendChild(dot);
  });
}

// --- Join ---
joinBtn.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname) return; // name is required

  const hex = colorInput.value; // "#rrggbb"
  const color = [
    parseInt(hex.substring(1, 3), 16),
    parseInt(hex.substring(3, 5), 16),
    parseInt(hex.substring(5, 7), 16),
  ];

  localPlayer = new Player(nickname, color);
  socket.emit('newPlayer', { name: localPlayer.getName(), color: localPlayer.getColor() });

  // Hide the form, show the game
  playerForm.classList.add('hidden');
  gridContainer.classList.remove('hidden');
  chatBox.classList.remove('hidden');
});

// --- Movement (WASD) ---
document.addEventListener('keydown', (e) => {
  if (!localPlayer) return;

  // If the user is typing in the chat (or any input), don't move
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  // Our position comes from the SERVER's copy, so we can never get out of sync
  const me = players[socket.id];
  if (!me) return;
  let [x, y] = me.pos;

  switch (e.key.toLowerCase()) {
    case 'w': y--; break;
    case 's': y++; break;
    case 'a': x--; break;
    case 'd': x++; break;
    default: return;
  }

  x = Math.max(0, Math.min(GRID_SIZE - 1, x));
  y = Math.max(0, Math.min(GRID_SIZE - 1, y));

  //check map[y][x] (17 = enter the dungeon)
  if (map[y][x]==17){
      //start countdown for game
      //all players standing on 17 should join the same game
      //new players should still spawn at the beggining
      //until the lobby 17 is free - the elements on main map should
      //be set to 0
      //methods for main mapp - eraseLobby(number)
      //setLobby(number) - with fixed values
  }


  console.log('asking server to move to', x, y); // debug - delete later
  socket.emit('move', { x, y }); // the dot moves when the server answers with updatePlayers
});

// --- Chat ---
function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit('chatMessage', { message });
  messageInput.value = '';
  messageInput.blur(); // leave the input so WASD works again
}
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
  if (e.key === 'Escape') messageInput.blur(); // Esc = stop typing
});

// --- Server events ---
socket.on('connect', () => console.log('connected to server')); // debug - delete later

socket.on('init', (data) => {
  map = data.map;
  players = data.players;
  generateGrid();
  renderPlayers();
});

socket.on('updatePlayers', (serverPlayers) => {
  players = serverPlayers;
  console.log('players from server:', players); // debug - delete later
  renderPlayers();
});

socket.on('chatMessage', ({ name, message }) => {
  const line = document.createElement('div');
  const bold = document.createElement('strong');
  bold.textContent = name + ': ';
  line.appendChild(bold);
  line.appendChild(document.createTextNode(message)); // textContent-safe, no HTML injection
  messagesContainer.appendChild(line);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});