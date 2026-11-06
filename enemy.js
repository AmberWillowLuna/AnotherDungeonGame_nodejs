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
        this.#maxhp = 1;
        this.#hp = 1;
        this.#name = "Enemy";
        this.#sprite = null;
        this.#weapon = null;
        this.#loot = 0;
        this.#power = 1;
    }

    hit(val, player){
    this.#hp -= val;
    if (this.#hp < 1) {
        player.earn(this.#loot);
    }
    }
}

class Goblin extends Enemy{
    constructor(){
        super();
        this.#maxhp = 2;
        this.#hp = 2;
        this.#name = "Goblin";
        this.#sprite = null;
        this.#weapon = new SharpMetal();
        this.#loot = 4;
        this.#power = 1;
    }
}