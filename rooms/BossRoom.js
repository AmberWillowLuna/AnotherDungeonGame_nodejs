const Room = require('../public/Room.js');



//a room with no exit - the exit spawns after defeating the enemy in the middle of the room
//a room with a boss - the exit spawns after defeating the boss in the middle of the room
// it has out of dungeon AND to the next room

class BossRoom extends Room{
    #type;
    #map;
    constructor(){
        super();
        this.#type = 4;
        let v = new Room();
        this.#map = v.getMap();
        this.#map.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 26); //boss is in the middle of the room, but not always in the same place
    }




}