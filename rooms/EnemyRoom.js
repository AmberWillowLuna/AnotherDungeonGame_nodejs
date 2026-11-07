const NothingRoom = require('./NothingRoom.js');




//a room with no exit - the exit spawns after defeating the enemy in the middle of the room
class EnemyRoom extends NothingRoom{
    #type;
    #map;
    constructor(){
        super();
        this.setType(2);
        //close all exits - the exit will spawn after defeating the enemy in the middle of the room
        //so the player has to defeat the enemy to escape the room
        //this.#map.setValue(0, 0, 1);
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.getValue(i, j) == 1) {
                    this.setValue(i, j, 0);
                }
            }
        }
        this.setValue(Math.floor(Math.random() * 4)+3,Math.floor(Math.random() * 4)+3, 100); //enemy is in the middle of the room, but not always in the same place
        
    }

    UnlockExit(){
        //exit alwyas at the top
        for (let i = 0; i < 4; i++) {
            this.setValue(i, 0, 1); 
        }

    }


}



module.exports = EnemyRoom;