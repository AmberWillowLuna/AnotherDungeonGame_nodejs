const Room = require('./Room.js');

class MainMap extends Room{
    #width;
    #height;
    constructor(){
        super()
        this.#width = 25;
        this.#height = 25;
        this.setMap([
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,28,0,27,0,26,0,25,0,24,0,23,0,22],

        ]); //this is going to be the tough one
        this.setType(0);
    }

    eraseLobby(number){
        x=width-1; // for 17..22
        y = height -1; // for 22..28
        switch(number){
            case 17:
                // fixed positions for lobby 17 should be:
                // x - alwyas last, y - idx 1,2,3,4
                //setValue(y, x, val)
                this.setValue(1, x, 0);
                this.setValue(2, x, 0);
                this.setValue(3, x, 0);    
                this.setValue(4, x, 0);               
            break;
            case 18:
                this.setValue(6, x, 0);
                this.setValue(7, x, 0);
                this.setValue(8, x, 0);    
                this.setValue(9, x, 0);   
            break;
            case 19:
                this.setValue(11, x, 0);
                this.setValue(12, x, 0);
                this.setValue(13, x, 0);    
                this.setValue(14, x, 0);   
            break;
            case 20:
                this.setValue(16, x, 0);
                this.setValue(17, x, 0);
                this.setValue(18, x, 0);    
                this.setValue(19, x, 0);   
            break;
            case 21:
                this.setValue(22, x, 0);
            break;
            case 22:
                this.setValue(y, x, 0);
            break;
            case 23:
                this.setValue(y, x-2, 0);
            break;
            case 24:
                this.setValue(y, x-4, 0);
            break;
            case 25:
                this.setValue(y, x-6, 0);
            break;
            case 26:
                this.setValue(y, x-8, 0);
            break;
            case 27:
                this.setValue(y, x-10, 0);
            break;
            case 28:
                this.setValue(y, x-12, 0);
            break;
        }
    }

    setLobby(number){
        x=width-1; // for 17..22
        y = height -1; // for 22..28
        switch(number){
            case 17:
                // fixed positions for lobby 17 should be:
                // x - alwyas last, y - idx 1,2,3,4
                //setValue(y, x, val)
                this.setValue(1, x, number);
                this.setValue(2, x, number);
                this.setValue(3, x, number);    
                this.setValue(4, x, number);               
            break;
            case 18:
                this.setValue(6, x, number);
                this.setValue(7, x, number);
                this.setValue(8, x, number);    
                this.setValue(9, x, number);   
            break;
            case 19:
                this.setValue(11, x, number);
                this.setValue(12, x, number);
                this.setValue(13, x, number);    
                this.setValue(14, x, number);   
            break;
            case 20:
                this.setValue(16, x, number);
                this.setValue(17, x, number);
                this.setValue(18, x, number);    
                this.setValue(19, x, number);   
            break;
            case 21:
                this.setValue(22, x, number);
            break;
            case 22:
                this.setValue(y, x, number);
            break;
            case 23:
                this.setValue(y, x-2, number);
            break;
            case 24:
                this.setValue(y, x-4, number);
            break;
            case 25:
                this.setValue(y, x-6, number);
            break;
            case 26:
                this.setValue(y, x-8, number);
            break;
            case 27:
                this.setValue(y, x-10, number);
            break;
            case 28:
                this.setValue(y, x-12, number);
            break;
        }
    }


}

module.exports =  MainMap;