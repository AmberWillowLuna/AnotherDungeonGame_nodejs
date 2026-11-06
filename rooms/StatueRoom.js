const NothingRoom = require('./NothingRoom.js');

class StatueRoom extends NothingRoom{
    #type;
    #map;
    constructor(){
        super();
        this.#type = 6;
        if (this.#map != null){
            this.#map.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 16); //statue is in the middle of the room, but not always in the same place
        }
        else{
            let v = new NothingRoom();
            this.#map = v.getMap();
            this.#map.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 16); //statue is in the middle of the room, but not always in the same place
        }

    }
}

// make rooms with enemies and bosses like this - enemy / boss in the middle - and escape spawns only after defeating foes


module.exports = StatueRoom;