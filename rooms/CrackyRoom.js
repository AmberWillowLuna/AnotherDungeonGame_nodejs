const NothingRoom = require('./NothingRoom.js');

class CrackyRoom extends NothingRoom{
    #type;
    #map;
    constructor(){
        super();
        this.setType(7);
        let rand = Math.floor(Math.random() * 2);
        this.setValue(0, 3, 1);
        this.setValue(0, 4, 1);
        this.setValue(0, 5, 1);
        this.setValue(0, 6, 1);
        if (rand == 0) {
            this.setValue(3, 0, 15);
            this.setValue(4, 0, 15);
            this.setValue(5, 0, 15);
            this.setValue(6, 0, 15);
        }
        else if (rand == 1) {
            this.setValue(3, 9, 15);
            this.setValue(4, 9, 15);
            this.setValue(5, 9, 15);
            this.setValue(6, 9, 15);
        }
    }
}


module.exports = CrackyRoom;
