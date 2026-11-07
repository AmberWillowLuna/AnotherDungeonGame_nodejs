const NothingRoom = require('./NothingRoom.js');

class TreasureRoom extends NothingRoom{
    #type;
    #map;
    constructor(number, rarity){
        super();

        this.setType(3);
        if (rarity!=null){

            if (rarity.length() == number){

                for(let i=0;i<number;i++){
                    this.setValue(Math.floor(Math.random() * 4)+3, Math.floor(Math.random() * 4)+3, 6+rarity[i]); //rarity is an array with rarity of each chest
                }
            }
        }
    }
}

// make rooms with enemies and bosses like this - enemy / boss in the middle - and escape spawns only after defeating foes


module.exports = TreasureRoom;