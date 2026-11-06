// Server-side inventory. There is one Inventory per player, kept in server.js
// (inventories[socketId]). The browser only DISPLAYS it - it can't change it.
//
// Items are plain objects like { name: 'Knife' } so they can be sent as JSON.
// Later you can look the name up in your weapon / tool / spell classes.

// How many items fit in each slot. Placeholder numbers - change them!
const LIMITS = {
  weapons: 3,
  tools: 4,
  trinkets: 5,
  spells: 2, // wizard gets 3 -> inventory.setLimit('spells', 3)
};

class Inventory {
  #gold = 0;
  #heals = 3;
  #slots = { weapons: [], tools: [], trinkets: [], spells: [] };
  #limits = { ...LIMITS };

  // ---------- items ----------
  // returns true if the item was added, false if the slot is full / unknown
  addItem(slot, item) {
    const list = this.#slots[slot];
    if (!list) return false;
    if (list.length >= this.#limits[slot]) return false;
    list.push(item);
    return true;
  }

  // returns the removed item, or null if there was none with that name
  removeItem(slot, name) {
    const list = this.#slots[slot];
    if (!list) return null;
    const i = list.findIndex((item) => item.name === name);
    if (i === -1) return null;
    return list.splice(i, 1)[0];
  }

  has(slot, name) {
    const list = this.#slots[slot];
    return !!list && list.some((item) => item.name === name);
  }

  setLimit(slot, limit) {
    if (slot in this.#limits) this.#limits[slot] = limit;
  }

  // ---------- gold ----------
  getGold() { return this.#gold; }
  addGold(amount) { this.#gold += amount; }
  spendGold(amount) {           // false = not enough gold, nothing is taken
    if (amount > this.#gold) return false;
    this.#gold -= amount;
    return true;
  }
  loseGold() { this.#gold = 0; } // for when a player dies

  // ---------- heals ----------
  getHeals() { return this.#heals; }
  addHeal(n = 1) { this.#heals += n; }
  useHeal() {                    // false = no heals left
    if (this.#heals <= 0) return false;
    this.#heals--;
    return true;
  }

  // plain copy of the data, safe to send to the browser
  toJSON() {
    const slots = {};
    for (const [name, list] of Object.entries(this.#slots)) {
      slots[name] = list.map((item) => ({ ...item }));
    }
    return { gold: this.#gold, heals: this.#heals, ...slots, limits: { ...this.#limits } };
  }
}

module.exports = Inventory;