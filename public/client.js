import Player from './Player.js'; // the file is called Player.js (capital P)

const socket = io(); // "io" comes from /socket.io/socket.io.js

// number in the map -> cell color. Add new tiles here!
const TILE_COLORS = {
  0: 'white',
  1: 'lightblue',   // next room
  2: 'orange',      // exit of the dungeon
  6: 'peru',        // chest (common)
  7: 'silver',      // chest (uncommon)
  8: 'gold',        // chest (rare)
  15: 'gray',       // sus wall
  16: 'darkgray',   // statue
  17: 'lightgreen', 18: 'lightgreen', 19: 'lightgreen', 20: 'lightgreen',
  21: 'green', 22: 'green', 23: 'green', 24: 'green',
  25: 'green', 26: 'green', 27: 'green', 28: 'green',
};

// optional symbol drawn on the tile
const TILE_LABELS = { 1: '→', 2: '↑', 6: 'c', 7: 'c', 8: 'c', 15: 'r', 16: 's' };

// --- HTML elements ---
const gridContainer = document.getElementById('grid');
const chatBox = document.getElementById('chat');
const statusBox = document.getElementById('status');
const placeText = document.getElementById('place');
const countdownText = document.getElementById('countdown');
const inventoryBox = document.getElementById('inventory');
const inventoryList = document.getElementById('inventoryList');
const playerForm = document.getElementById('playerForm');
const nicknameInput = document.getElementById('nickname');
const colorInput = document.getElementById('color');
const joinBtn = document.getElementById('joinBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');

// --- State ---
let map = null;          // the map of the place we are in (lobby or dungeon room), sent by the server
let players = {};        // everybody in the same place, sent by the server
let localPlayer = null;  // null until the user joins
const countdowns = {};   // lobby number -> seconds left

// --- Drawing ---
function generateGrid() {
  const rows = map.length;
  const cols = map[0].length; // dungeon rooms are 10x10, the lobby is 25x25
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 20px)`;
  gridContainer.innerHTML = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tile = map[row][col];
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.style.backgroundColor = TILE_COLORS[tile] || 'white';
      cell.textContent = TILE_LABELS[tile] || '';
      gridContainer.appendChild(cell);
    }
  }
}

function renderPlayers() {
  if (!map) return;
  document.querySelectorAll('.player').forEach(el => el.remove());
  const cols = map[0].length;
  Object.values(players).forEach((player) => {
    const [x, y] = player.pos;
    const cell = gridContainer.children[y * cols + x];
    if (!cell) return;
    const dot = document.createElement('div');
    dot.className = 'player';
    dot.textContent = player.name[0];
    dot.style.backgroundColor = `rgb(${player.color.join(',')})`;
    cell.appendChild(dot);
  });
}

function renderCountdowns() {
  if (countdownText==null) return; // Guard against missing DOM element
  countdownText.textContent = Object.entries(countdowns)
    .map(([lobby, seconds]) => `Lobby ${lobby} starts in ${seconds}s`)
    .join('  |  ');
}

function renderInventory(inv) {
  if (inventoryList==null) return; // Guard against missing DOM element
  inventoryList.innerHTML = '';
  const lines = [
    ['Gold', inv.gold],
    ['Heals', inv.heals],
    [`Weapons (${inv.weapons.length}/${inv.limits.weapons})`, inv.weapons.map(i => i.name).join(', ') || '-'],
    [`Tools (${inv.tools.length}/${inv.limits.tools})`, inv.tools.map(i => i.name).join(', ') || '-'],
    [`Trinkets (${inv.trinkets.length}/${inv.limits.trinkets})`, inv.trinkets.map(i => i.name).join(', ') || '-'],
    [`Spells (${inv.spells.length}/${inv.limits.spells})`, inv.spells.map(i => i.name).join(', ') || '-'],
  ];
  for (const [label, value] of lines) {
    const row = document.createElement('div');
    const bold = document.createElement('strong');
    bold.textContent = label + ': ';
    row.appendChild(bold);
    row.appendChild(document.createTextNode(String(value)));
    inventoryList.appendChild(row);
  }
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
  if (playerForm==null) return; // Guard against missing DOM element
  playerForm.classList.add('hidden');
  [gridContainer, chatBox, statusBox, inventoryBox].forEach(el => el.classList.remove('hidden'));
});

// --- Movement (WASD) ---
document.addEventListener('keydown', (e) => {
  if (!localPlayer || !map) return;

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

  x = Math.max(0, Math.min(map[0].length - 1, x));
  y = Math.max(0, Math.min(map.length - 1, y));

  // The server decides what the tile does (lobby countdown, chest, next room...)
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
// The map we should show changed (joined, lobby opened/closed, new dungeon room, chest taken)
socket.on('mapUpdate', ({ map: newMap, title, place }) => {
  map = newMap;
  placeText.textContent = title;
  if (place === 'dungeon') {
    for (const lobby in countdowns) delete countdowns[lobby]; // lobby timers are only for the lobby
    renderCountdowns();
  }
  generateGrid();
  renderPlayers();
});

socket.on('updatePlayers', (serverPlayers) => {
  players = serverPlayers;
  renderPlayers();
});

// secondsLeft === null means: countdown was reset / finished
socket.on('lobbyStatus', ({ lobby, secondsLeft }) => {
  if (secondsLeft === null) delete countdowns[lobby];
  else countdowns[lobby] = secondsLeft;
  renderCountdowns();
});

socket.on('inventory', renderInventory);

socket.on('chatMessage', ({ name, message }) => {
  const line = document.createElement('div');
  const bold = document.createElement('strong');
  bold.textContent = name + ': ';
  line.appendChild(bold);
  line.appendChild(document.createTextNode(message)); // textContent-safe, no HTML injection
  messagesContainer.appendChild(line);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});