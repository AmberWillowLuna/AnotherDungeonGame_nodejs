class Room {
    #map;
    #type;
    constructor(){
        this.#type=-1;
    }

    setValue(y, x, val){
        this.#map[y][x]=val;
    }

    setMap(map) {
        this.#map=map;
    }
    setType(type){
        this.#type=type
    }

    getMap() {
        return this.#map;
    }

    getType() {
        return this.#type;
    }
}


module.exports = Room;
/*
one block:
0 - basic ground
1 - go to the next room
2 - go out of the dungeon
3 - merchant
4 5 ^
6 - 14 chests (diff rarity)
15 sus wall
16 statues
17 - Enter the dungeon 17
18 - lobby18
19 - lobby 19
20 - lobby 20
21 - single player lobbies
22... 24 - signle player lobbies


Type:
0 main
1 nothing
2 escape
3 treasure
4 enemy 
5 boss
6 statues
7 cracky room
*/

