const Room = require('../public/Room.js');




//a room with no exit - the exit spawns after defeating the enemy in the middle of the room
class EnemyRoom extends Room{
    #type;
    #map;
    constructor(){
        super();
        this.#type = 2;
        let v = new Room();
        this.#map = v.getMap();
        this.#map.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 25); //enemy is in the middle of the room, but not always in the same place
    }

    UnlockExit(){
        this.#map.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 1); //exit is in the middle of the room, but not always in the same place
    }


}
