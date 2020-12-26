var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // If filling and no energy left, turn off filling
	    if(creep.memory.filling && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0) {
            creep.memory.filling = false;
            creep.say('Harvesting')
        }
        if(!creep.memory.filling && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
            creep.memory.filling = true;
            creep.say('Filling')
        }
        
            // Targets that require filling
        if(creep.memory.filling){
            
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER || (structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapcity < 300)) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if(targets.length == 0){
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.room.controller);
                }
            }
        }
        else {
            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE){
                creep.moveTo(sources);
            }
        }
    }
	
};

module.exports = roleHarvester;