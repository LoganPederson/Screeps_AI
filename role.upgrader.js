var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }
	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        // IF NOT UPGRADING AND INVENTORY NOT FULL ->
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() != 0) {
            var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) != 0);
            // IF CONTAINERS PRESENT -> COLLECT FROM CONTAINER
            if(containers.length > 0){
                var closest_container = creep.pos.findClosestByPath(containers);
                if(creep.withdraw(closest_container,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(closest_container);
                }
            }
            // IF NO CONTAINER -> HARVEST SOURCE
            else{
                sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[0]);
                }
            }
        }
	}
};

module.exports = roleUpgrader;