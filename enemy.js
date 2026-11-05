import  './weapon.js';

class Enemy(){
    #maxhp;
    #hp;
    #name;
    #sprite;
    #weapon;
    #loot;
    #power;
    constructor(){
    }

    hit(val){
    this.#hp -= val;
    if this.#hp<1
      player.#gold = 0
  }
}

class Goblin(Enemy){
    constructor(){
        #maxhp = 2;
        #hp = 2;
        #name = "Goblin";
        #sprite = null;
        #weapon = new SharpMetal();
        #loot = 4;
        #power = 1;
    }
}