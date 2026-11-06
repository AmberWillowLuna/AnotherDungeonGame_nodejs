class Weapon{
    #value; //constant value
    #swing; //the roll value (1d6 roll default - so 6)
    #rarity; // -1 - not availabl for players 
     // then 0 is very common then the higher the more hard to get
    #status; //if the weapon is broken or not
    #bonusValue; //
    #bonusSwing; //
    #bonusClass; //the class you have to play to get bonuses
    //remember they all can break
    #breakability; // this is the description of how often it can break
    #durability; // this is how many times the weapon can break
    #dmg;

    constructor(value, swing, rarity, breakability) {
        this.#value = value;
        this.#swing = swing;
        this.#status = True;
        this.#rarity = rarity;
        this.#breakability = breakability;
        this.#dmg=1;
    }

    use(){
        bonus = Math.floor(Math.random() * this.#swing) + 1;

        if (bonus == 1 && this.#breakability == "weak") {
            this.#status = false;
        }
        return this.#value + bonus;
    }

    getValue(){
        return this.#value;
    }
    
    specials(){
        return;
    }
}

class Knife extends Weapon{
    constructor(){
        super(1, 4, 0, "weak")
    }
}

class SharpMetal extends Weapon{
    constructor(){
        super(2,0,-1,"weak")
    }
}

class Knife extends Weapon{
    constructor(){
        super(1, 4, -1)
    }
}


class Boomerang extends Weapon{
    constructor(){
        super(1, 6, 1, "weak")
    }
}

class Dagger extends Weapon{
    constructor(){
        super(2, 4, 1, "weak")
    }
}

class Stick extends Weapon{
    constructor(){
        super(2, 2, 1, "weak")
    }
}

class IceSpike extends Weapon{
    constructor(){
        super(3, 4, 2, "weak")
    }
}

class Bow extends Weapon{
    constructor(){
        super(4, 8, 4, "weak")
    }
}

class Sword extends Weapon{
    constructor(){
        super(5, 6, 5, "weak")
    }    
}

