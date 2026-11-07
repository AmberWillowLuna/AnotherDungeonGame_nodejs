const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const MainMap = require('./public/mainMap.js'); // server-side only (CommonJS)
const Inventory = require('./inventory.js');
const { Dungeon } = require('./dungeon.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// ================= settings =================
const SPAWN = [12, 12];        // where players appear in the main lobby
const COUNTDOWN_SECONDS = 5;   // lobby closes this many seconds after someone steps on it
const SOLID = [15, 16];        // tiles you can't walk into (sus wall, statue)
const MAIN_TITLE = 'Main lobby';

// ================= state =================
const mainMap = new MainMap();
const players = {};      // { socketId: { name, color, pos, dungeonId } }  - public, others see it
const inventories = {};  // { socketId: Inventory }                         - private, only the owner gets it
const dungeons = {};     // { dungeonId: Dungeon }
const countdowns = {};   // { lobbyNumber: intervalId }  - only exists while a countdown is running
let nextDungeonId = 1;

// ================= helpers =================
// Every player is in a socket.io "room": 'main' or 'dungeon:<id>'.
// We only send updates to the room the player is in.
const placeOf = (p) => (p.dungeonId === null ? 'main' : `dungeon:${p.dungeonId}`);
const mapOf = (p) => (p.dungeonId === null ? mainMap.getMap() : dungeons[p.dungeonId].getMap());

const mainPayload = () => ({ map: mainMap.getMap(), title: MAIN_TITLE, place: 'main' });
const dungeonPayload = (d) => ({ map: d.getMap(), title: d.getTitle(), place: 'dungeon' });

// sends the players that stand in `place` to everybody in `place`
function broadcastPlayers(place) {
  const here = {};
  for (const [id, p] of Object.entries(players)) {
    if (placeOf(p) === place) here[id] = p;
  }
  io.to(place).emit('updatePlayers', here);
}

// every socket automatically sits in a room named like its own id
function sendInventory(id) {
  io.to(id).emit('inventory', inventories[id].toJSON());
}

function moveToPlace(id, from, to) {
  io.in(id).socketsLeave(from);
  io.in(id).socketsJoin(to);
}

// ================= lobbies =================
const isLobbyTile = (v) => v >= 17 && v <= 28;

// lobby number the player is standing on (null if none / inside a dungeon)
function lobbyAt(p) {
  if (p.dungeonId !== null) return null;
  const tile = mainMap.getMap()[p.pos[1]][p.pos[0]];
  return isLobbyTile(tile) ? tile : null;
}

function playersInLobby(n) {
  return Object.keys(players).filter((id) => lobbyAt(players[id]) === n);
}

// Called whenever someone enters or leaves a lobby tile.
// someone inside -> countdown runs, nobody inside -> countdown resets.
function refreshLobby(n) {
  if (playersInLobby(n).length > 0) startCountdown(n);
  else stopCountdown(n);
}

function startCountdown(n) {
  if (countdowns[n]) return; // already running - don't restart it
  console.log(`[lobby ${n}] someone stepped in - countdown started`);
  let secondsLeft = COUNTDOWN_SECONDS;
  io.to('main').emit('lobbyStatus', { lobby: n, secondsLeft });

  countdowns[n] = setInterval(() => {
    secondsLeft--;
    if (secondsLeft > 0) {
      io.to('main').emit('lobbyStatus', { lobby: n, secondsLeft });
    } else {
      stopCountdown(n);
      try {

        //??
        console.log(`[lobby ${n}] countdown finished - launching the dungeon`);
        launchDungeon(n);
      } catch (err) {
        // a bug while launching must not kill the whole server
        console.error(`[lobby ${n}] COULD NOT START THE DUNGEON:`, err);
      }
    }
  }, 1000);
}

function stopCountdown(n) {
  if (!countdowns[n]) return;
  console.log(`[lobby ${n}] countdown stopped`);
  clearInterval(countdowns[n]);
  delete countdowns[n];
  io.to('main').emit('lobbyStatus', { lobby: n, secondsLeft: null }); // null = hide it
}

// ================= dungeons =================
function launchDungeon(n) {
  const ids = playersInLobby(n);
  if (ids.length === 0) return;
  console.log(`[lobby ${n}] launching a dungeon with ${ids.length} player(s)`);

  mainMap.eraseLobby(n); // lobby disappears from the map, nobody new can join

  const dungeonId = nextDungeonId++;
  const dungeon = new Dungeon(n, ids);
  dungeons[dungeonId] = dungeon;
  const place = `dungeon:${dungeonId}`;

  ids.forEach((id, i) => {
    players[id].dungeonId = dungeonId;
    players[id].pos = dungeon.spawnPoint(i);
    moveToPlace(id, 'main', place);
  });

  console.log(`[dungeon ${dungeonId}] created: ${dungeon.getTitle()}`);
  io.to(place).emit('mapUpdate', dungeonPayload(dungeon));
  io.to('main').emit('mapUpdate', mainPayload()); // the others see the lobby vanish
  broadcastPlayers(place);
  broadcastPlayers('main');
}

// bookkeeping when a player leaves a dungeon (walked out OR disconnected).
// When the last player is gone the dungeon is deleted and the lobby opens again.
function removeFromDungeon(id) {
  const p = players[id];
  const dungeonId = p.dungeonId;
  const dungeon = dungeons[dungeonId];

  dungeon.removePlayer(id);
  p.dungeonId = null;

  if (dungeon.isEmpty()) {
    delete dungeons[dungeonId];
    console.log(`[dungeon ${dungeonId}] empty - lobby ${dungeon.getLobby()} is open again`);
    mainMap.setLobby(dungeon.getLobby());
    io.to('main').emit('mapUpdate', mainPayload());
  }
}

function enemyEncounter(id, p, dungeon, x, y) {
  //get from dungeon.enemy 
  let enemy = dungeon.getEnemies()[0]; //get the first enemy in the array
  //start the encounter with the player and the enemy
  //send the player and the enemy to the client
  io.to(id).emit('enemyEncounter', { enemy: enemy, player: p });
}

// player walked on tile 2 - back to the main lobby
function leaveDungeon(id) {
  const p = players[id];
  const oldPlace = placeOf(p);

  removeFromDungeon(id);
  p.pos = [...SPAWN];
  moveToPlace(id, oldPlace, 'main');

  io.to(id).emit('mapUpdate', mainPayload());
  broadcastPlayers(oldPlace);
  broadcastPlayers('main');
}

// player walked on tile 1 - the whole group goes to a new room
function nextRoom(dungeonId) {
  const dungeon = dungeons[dungeonId];
  const place = `dungeon:${dungeonId}`;

  dungeon.nextRoom();
  dungeon.getPlayerIds().forEach((id, i) => {
    players[id].pos = dungeon.spawnPoint(i);
  });

  io.to(place).emit('mapUpdate', dungeonPayload(dungeon));
  broadcastPlayers(place);
}

// what happens when a player steps on a tile inside a dungeon
function onDungeonTile(id, p) {
  const dungeonId = p.dungeonId;
  const dungeon = dungeons[dungeonId];
  const [x, y] = p.pos;
  const tile = dungeon.getMap()[y][x];

  if (tile === 1) return nextRoom(dungeonId);
  if (tile === 2) return leaveDungeon(id);
  if (tile >= 6 && tile <= 14) return onChest(id, p, dungeon, x, y);
  if (tile === 3) return; // merchant - not implemented yet
  if (tile === 4) return; // enemy - not implemented yet
  if (tile === 5) return; // boss - not implemented yet
  if (tile === 100) EnemyEncounter(id, p, dungeon, x, y); // enemy encounter - not implemented yet

  const rarity = dungeon.takeChest(x, y); // null if it's not a chest
  if (rarity !== null) {
    // placeholder loot: gold. Here you would roll an item and use:
    // inventories[id].addItem('weapons', { name: 'Knife' });
    inventories[id].addGold((rarity + 1) * (1 + Math.floor(Math.random() * 3)));
    sendInventory(id);
    io.to(placeOf(p)).emit('mapUpdate', dungeonPayload(dungeon)); // chest disappears
  }
  broadcastPlayers(placeOf(p));
}

// ================= sockets =================
io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Player picked name + color
  socket.on('newPlayer', ({ name, color, class: pclass } = {}) => {
    if (players[socket.id]) return; // already joined

    const cleanName = String(name || '').trim().slice(0, 16);
    const validColor = Array.isArray(color) && color.length === 3 &&
                       color.every((c) => Number.isInteger(c) && c >= 0 && c <= 255);
    if (!cleanName) return;

    players[socket.id] = {
      name: cleanName,
      color: validColor ? color : [255, 0, 0],
      class: pclass || 'barbarian',
      pos: [...SPAWN],
      dungeonId: null,
    };
    inventories[socket.id] = new Inventory();

    socket.join('main');
    socket.emit('mapUpdate', mainPayload()); // always the CURRENT map
    sendInventory(socket.id);
    broadcastPlayers('main');
  });

  // Player moved one tile
  socket.on('move', ({ x, y } = {}) => {
    const p = players[socket.id];
    if (!p) return; // hasn't joined yet

    const map = mapOf(p);
    const inside = Number.isInteger(x) && Number.isInteger(y) &&
                   y >= 0 && y < map.length && x >= 0 && x < map[0].length;
    if (!inside) return;
    if (Math.abs(x - p.pos[0]) + Math.abs(y - p.pos[1]) > 1) return; // max 1 tile
    if (SOLID.includes(map[y][x])) return;                           // walls block you

    const leftLobby = lobbyAt(p); // lobby we are standing on BEFORE the move
    p.pos = [x, y];

    if (p.dungeonId !== null) {
      onDungeonTile(socket.id, p);
      return;
    }

    // main lobby: update the countdowns of the lobby we left and the one we entered
    if (leftLobby) refreshLobby(leftLobby);
    const enteredLobby = lobbyAt(p);
    if (enteredLobby) refreshLobby(enteredLobby);
    broadcastPlayers('main');
  });

  // Chat (only for players who joined)
  socket.on('chatMessage', ({ message } = {}) => {
    const p = players[socket.id];
    if (!p) return;
    io.emit('chatMessage', { name: p.name, message: String(message).slice(0, 200) });
  });

  socket.on('disconnect', () => {
    const p = players[socket.id];
    if (!p) return;

    const place = placeOf(p);
    const lobby = lobbyAt(p);
    if (p.dungeonId !== null) removeFromDungeon(socket.id);

    delete players[socket.id];
    delete inventories[socket.id];

    if (lobby) refreshLobby(lobby); // maybe the countdown has to reset
    broadcastPlayers(place);
  });
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));