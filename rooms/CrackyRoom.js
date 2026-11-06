const NothingRoom = require('./NothingRoom.js');

class CrackyRoom extends NothingRoom{
    #type;
    #map;
    constructor(){
        super();
        this.#type = 7;
        let v = new NothingRoom();
        this.#map = v.getMap();
        let rand = Math.floor(Math.random() * 2);
        this.#map[0][3]=1;
        this.#map[0][4]=1;
        this.#map[0][5]=1;
        this.#map[0][6]=1;        
        if (rand == 0) {
            this.#map[3][0]=15;
            this.#map[4][0]=15;
            this.#map[5][0]=15;
            this.#map[6][0]=15;
        }
        else if (rand == 1) {
            this.#map[3][9]=15;
            this.#map[4][9]=15;
            this.#map[5][9]=15;
            this.#map[6][9]=15;
        }
    }
}


module.exports = CrackyRoom;
