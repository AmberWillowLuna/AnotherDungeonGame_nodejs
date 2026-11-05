const Room = require('./NothingRoom.js');

class TreasureRoom(NothingRoom){
    constructor(number, rarity){
        super();
        if length(rarity)==number{
            #type = 3;

            for(i=0;i<number;i++){
                #map[Math.floor(Math.rand() * 4)+3][Math.floor(Math.rand() * 4)+3] = 6+rarity[i]; //rarity is an array with rarity of each chest
            }
        }

    }
}

// make rooms with enemies and bosses like this - enemy / boss in the middle - and escape spawns only after defeating foes


module.exports = TreasureRoom;