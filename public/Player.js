export default class Player {
  #maxhp;
  #hp;
  #heals;
  #weapons;
  #tools;
  #trinkets;
  #name;
  #color;
  #weapon;
  #pos;
  #level;
  #loot;
  #gold;
  #surv;
  #bonusStr; // bonus str will dissapear at the end of battle
  #spells;
  #class;
  constructor(name, color, pclass) {
    this.#maxhp = 6;
    this.#hp = 6;
    this.#heals = [];
    this.#weapons = [];
    this.#tools = [];
    this.#trinkets = [];
    this.#name = name;
    this.#color = color;
    this.#pos = [Math.floor(Math.random() * 5) - 2, Math.floor(Math.random() * 5) - 2];
    this.#weapon = null;
    this.#level = 0;
    this.#loot = 0;
    this.#gold = 0;
    this.#surv = 0;
    this.#bonusStr = 0;
    this.#spells = []; // up to 2 - wizard gets 3 spells - reset after escape or with a tool
    this.#class = pclass;
    /* TODO IMPLEMENT CLASS BONUSES */


  }

  // Getters and setters for properties
  getName() { return this.#name; }
  getColor() { return this.#color; }
  getPos() { return this.#pos; }
  getHp() { return this.#hp; }
  getMaxHp() { return this.#maxhp; }
  getLevel() { return this.#level; }
  getGold() { return this.#gold; }
  getSurv() { return this.#surv; }
  getClass() { return this.#class; }

  setPos(x, y) { this.#pos = [x, y]; }
  setHp(hp) { this.#hp = Math.min(hp, this.#maxhp); }
  setLevel(level) { this.#level = level; }
  setGold(gold) { this.#gold = gold; }
  setSurv(surv) { this.#surv = surv; }
  setClass(pclass) { this.#class = pclass; }

  heal(val){
    this.#hp+=val;
    if (this.#hp>this.#maxhp) {
      this.#hp = this.#maxhp
    }
  }
  
  hit(val){
    this.#hp -= val;
    if (this.#hp<1){
      player.#gold = 0
    }
  }

  attack(type, name){
    if (type=="weapon"){
      enemy.hit(this.#weapon.dmg)
    }
    else if (type=="spell"){

      //MAKE THE SPELL .use() method
      //TO AVOID IF ELSE CODING

      if (name=="Shadow Bolt") {
        enemy.hit(2)
      }
    }
  }

}
