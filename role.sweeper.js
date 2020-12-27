var roleSweeper = {
    run: function(creep){
        // Sweeper should move to closest ruin, collect the energy, and request pickup when full (possibly drop off itself)                 Save closestRuin to memory soon
        var ruins = creep.room.find(FIND_RUINS).filter(ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0);
        var closestRuin = creep.pos.findClosestByPath(ruins);
        
        // If not scavaging and inv empty -> Stop requesting pickup, start scavaging
        if(!creep.memory.scavaging && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
            creep.memory.requestingPickup = false;
            creep.memory.scavaging = true;
            creep.say('Thx');
        }
        // If scavaging and inv full -> stop scavaging start requesting pickup 
        if(creep.memory.scavaging && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0){
            creep.memory.scavaging = false;
            creep.memory.requestingPickup = true;
        }
        // If scavaging && inv not full
        if(creep.memory.scavaging && creep.store.getUsedCapacity([RESOURCE_ENERGY]) < creep.store.getCapacity([RESOURCE_ENERGY])){
            if(creep.withdraw(closestRuin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(closestRuin);
                creep.say('Moving To closest Ruin!');
            }
            else{
                if(closestRuin && closestRuin.store.getUsedCapacity([RESOURCE_ENERGY]) > 0){
                    creep.withdraw(closestRuin, RESOURCE_ENERGY);
                }
            }
        }
            // Targets that require filling
        if(creep.memory.requestingPickup===true){
            var pickupTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: { memory: { role: 'mule' } }
            });
            creep.transfer(pickupTarget,RESOURCE_ENERGY);
        }
    }
}

module.exports = roleSweeper;