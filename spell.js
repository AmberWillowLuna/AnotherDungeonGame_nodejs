class Spell(){
    #name;
    #state;

    constructor(name){
        #state = True;
        #name=name
    }
    Use(player, enemy){
        #state = False
        return
    }
}

class Rage(Spell){
    constructor{
        super("Rage")
    }
    Use(player, enemy){
        player.bonusStr += 3
    }
}

class LifeSteal(Spell){
    constructor{
        super("Life Steal")
    }
    Use(player, enemy){
        cur = enemy.hp
        //after implementing attack use attack

        if (enemy.hp<cur) {
            player.heal(1)
        }
    }
}

class ShadowBolt(Spell){
    constructor{
        super("Shadow Bolt")
    }
    Use(player, enemy){
        if player.hp>1 {
            //attack implementation with bonus +5 base and +10 swing and
            // taking 2 enemy hp - i dunno how im gonna do it tho
            // taking 1 player hp

            //if target had been hit
            enemy.hit(2)

            //alwyas
            player.hit(1)

        }
    }
}