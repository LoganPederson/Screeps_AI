var roleClaimer = {
    //Claimer should be able to assign room to memory, move to room, claim controller, then ?
    run: function(creep){

        //VARIABLES
        var blueFlags = _.filter(Game.flags, (f) => f.color === COLOR_BLUE);
        var blueFlag = blueFlags[0];
        
        
        //IF NO claimRoom IN MEMORY SET IT TO ROOM CONTAINING BLUE FLAG
        if(!creep.memory.claimRoom){
            creep.memory.claimRoom = blueFlag.pos.roomName;
        }

        //IF CREEP NOT IN CLAIM ROOM -> MOVE TO BLUE FLAG
        if(creep.pos != blueFlag.pos && !creep.memory.correctRoom){
            let flagRoom = blueFlag.pos.roomName
            console.log(creep.pos.roomName + ' ' + blueFlag.pos.roomName)
            creep.moveTo(blueFlag);
            //console.log(creep.room.name + ' ' + creep.memory.claimRoom)
            console.log('claimer moving to claimroom')
        }
        //IF CREEP IN CLAIM ROOM -> CLAIM CONTROLLER
        if(creep.pos.x === blueFlag.pos.x && creep.pos.y === blueFlag.pos.y){
            creep.memory.correctRoom = true;
        }
        
        if(creep.memory.correctRoom){
            if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE){
                creep.moveTo(blueFlag.room.controller);
                console.log('Claimer moving to controller to claim!')
            }
            else if(creep.signController(creep.room.controller, 'Serendipity!') === ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        }
    }
};
module.exports = roleClaimer;