const { SharpMetal } = require("./weapon.js");

class Enemy{
        _maxhp;
        _hp;
        _name;
        _sprite;
        _weapon;
        _loot;
        _power;

    constructor(){
        this._maxhp = 1;
        this._hp = 1;
        this._name = "Enemy";
        this._sprite = null;
        this._weapon = null;
        this._loot = 0;
        this._power = 1;
    }

    hit(val, player){
    this._hp -= val;
    if (this._hp < 1) {
        player.earn(this._loot);
    }
    }
    
}

class Goblin extends Enemy{
    _maxhp;
    _hp;
    _name;
    _sprite;
    _weapon;
    _loot;
    _power;

    constructor(){
        super();
        this._maxhp = 2;
        this._hp = 2;
        this._name = "Goblin";
        this._sprite = null;
        this._weapon = new SharpMetal();
        this._loot = 4;
        this._power = 1;
    }
}




module.exports = { Goblin };