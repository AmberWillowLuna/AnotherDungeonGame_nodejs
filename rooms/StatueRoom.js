const Room = require('./NothingRoom.js');

class StatueRoom(NothingRoom){
    constructor(){
        super();
        #type = 6;

        for(i=0;i<number;i++){
            #map[Math.floor(Math.rand() * 4)+3][Math.floor(Math.rand() * 4)+3] = 16; //rarity is an array with rarity of each chest
        }

    }
}

// make rooms with enemies and bosses like this - enemy / boss in the middle - and escape spawns only after defeating foes


module.exports = StatueRoom;