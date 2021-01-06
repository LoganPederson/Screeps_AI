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
            creep.moveTo(blueFlag);
            console.log('claimer moving to claimRoom')
        }
        //IF CREEP IN CLAIM ROOM -> CLAIM CONTROLLER
        if(creep.pos.x === blueFlag.pos.x && creep.pos.y === blueFlag.pos.y){
            creep.memory.correctRoom = true;
        }
        
        //IF IN CORRECT ROOM
        if(creep.memory.correctRoom){
            //CLAIM CONTROLLER
            if(creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE){
                creep.moveTo(blueFlag.room.controller);
                console.log('Claimer moving to controller to claim!')
            }
            //SIGN CONTROLLER
            else if(creep.signController(creep.room.controller, 'Serendipity!') === ERR_NOT_IN_RANGE && creep.room.controller.sign.text != 'Serendipity!'){
                creep.moveTo(creep.room.controller);
                console.log('Claimer signing!')
            }
            //IF ABOVE DONE, UPGRADE CONTROLLER
            else{
                let sources = creep.room.find(FIND_SOURCES);
                //IF INVENTORY EMPTY -> COLLECT ENERGY
                if(creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
                    creep.memory.collecting = true;
                }
                //IF INVENTORY FULL -> STOP COLLECTING
                if(creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
                    creep.memory.collecting = false;
                }
                
                //IF COLLECTING
                if(creep.memory.collecting){
                    if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE){
                        creep.moveTo(sources[0]);
                    }
                }
                //IF NOT COLLECTING -> UPGRADE
                else{
                    if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE){
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};
module.exports = roleClaimer;