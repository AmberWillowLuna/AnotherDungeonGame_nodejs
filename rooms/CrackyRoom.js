const Room = require('./NothingRoom.js');

class CrackyRoom(NothingRoom){
    constructor(){
        super();
        #type = 7;
        rand = Math.floor(Math.rand() * 2);
        #map[0][3]=1;
        #map[0][4]=1;
        #map[0][5]=1;
        #map[0][6]=1;        
        if rand == 0 {
            #map[3][0]=15;
            #map[4][0]=15;
            #map[5][0]=15;
            #map[6][0]=15;
        }
        else if rand == 1 {
            #map[3][9]=15;
            #map[4][9]=15;
            #map[5][9]=15;
            #map[6][9]=15;
        }
    }
}


module.exports = CrackyRoom;
