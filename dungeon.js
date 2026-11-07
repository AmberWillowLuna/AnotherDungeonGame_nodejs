const NothingRoom = require('./rooms/NothingRoom.js');
const EscapeRoom = require('./rooms/EscapeRoom.js');
const TreasureRoom = require('./rooms/TreasureRoom.js');
const StatueRoom = require('./rooms/StatueRoom.js');
const EnemyRoom = require('./rooms/EnemyRoom.js');
const BossRoom = require('./rooms/BossRoom.js');

//import Goblin from './enemy.js';
const { Goblin } = require('./enemy.js');

const BOSS_FROM_LEVEL = 10; // after 10 rooms enemies/nothing get rarer and bosses appear

// ---------- the rules from your concept ----------
// weights = % chance for each kind of room. Each table adds up to 100.
function roomTable(level) {
  if (level < BOSS_FROM_LEVEL) {
    return { nothing: 15, treasure: 20, escape: 5, enemy: 50, statue: 10 };
  }
  return { nothing: 10, treasure: 20, escape: 5, enemy: 40, statue: 15, boss: 10 };
}

// Chest rarity: 0 common, 1 uncommon, 2 rare. Level dependent.
// Level 0: 50% / 50% / 0%. Every level 3% moves from common to rare (max 30%).
function rollChestRarity(level) {
  const rare = Math.min(level * 3, 30);
  const uncommon = 50;
  const roll = Math.random() * 100;
  if (roll < rare) return 2;
  if (roll < rare + uncommon) return 1;
  return 0;
}

// picks a key of { name: weight } at random, bigger weight = more likely
function pickWeighted(table) {
  const total = Object.values(table).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [name, weight] of Object.entries(table)) {
    roll -= weight;
    if (roll < 0) return name;
  }
}

function makeRoom(level) {
  switch (pickWeighted(roomTable(level))) {

      case 'treasure': return new TreasureRoom(rollChestRarity(level));
      case 'escape':   return new EscapeRoom();
      case 'enemy':    return new EnemyRoom();
      case 'statue':   return new StatueRoom(1 + Math.floor(Math.random() * 3));
      case 'boss':     return new BossRoom();
      default:         return new NothingRoom();
  }
}

// ---------- one running dungeon ----------
class Dungeon {
  #lobby;      // which lobby (17..28) it came from - reopened when the dungeon ends
  #level = 0;  // how many rooms were already passed
  #room;
  #playerIds;
  #enemies;
  // #enemies; #bosses;  <- later

  constructor(lobby, playerIds) {
    this.#lobby = lobby;
    this.#playerIds = new Set(playerIds);
    this.#room = makeRoom(this.#level);
    this.#enemies = [new Goblin()]; // later: spawn enemies based on room type
  }

  getLobby() { return this.#lobby; }
  getLevel() { return this.#level; }
  getMap() { return this.#room.getMap(); }
  getTitle() { return `Dungeon (lobby ${this.#lobby}) - room ${this.#level + 1}`; }

  getPlayerIds() { return [...this.#playerIds]; }
  removePlayer(id) { this.#playerIds.delete(id); }
  isEmpty() { return this.#playerIds.size === 0; }

  // where the i-th player appears in a new room (bottom row is always free)
  spawnPoint(i) { return [3 + (i % 4), 9]; }

  nextRoom() {
    console.log(`dungeon ${this.#lobby} - next room`);
    this.#level++;
    this.#room = makeRoom(this.#level);
  }

  // If there is a chest on (x, y): removes it and returns its rarity. Otherwise null.
  takeChest(x, y) {
    const tile = this.#room.getMap()[y][x];
    if (tile < 6 || tile > 14) return null;
    this.#room.setValue(y, x, 0);
    return tile - 6;
  }
}

module.exports = { Dungeon, rollChestRarity, roomTable };

/*
First dungeon concept
15% for nothing
15% for chest rarity 0 - make it LEVEL DEPENDENT
15% for chest rarity 1  - make it LEVEL DEPENDENT
0% for chest rarity 2 - make it LEVEL DEPENDENT
15% for escape room - you can get back this way
20% bonus enemy
20% room with statues
after lvel is 12 (so after 12 rooms)
the enemy is reduced to 15 and nothing to 10 
and 10% for boss 

bosses in each dungon would be like 3 and have unique trinkets
but u only would need to kill one to be able to get to second dungeon

make the game this way quazi linear

*/