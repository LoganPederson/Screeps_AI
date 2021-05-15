var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //VARIABLES
        var creepsInRoomArray = creep.room.find(FIND_MY_CREEPS);
        var mulesInRoom = _.filter(creepsInRoomArray, (creep) => creep.memory.role === 'mule');
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) != 0);
        var closest_container = creep.pos.findClosestByPath(containers);


        //IF UPGRADING & EMPTY
        if(creep.memory.upgrading && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
            creep.memory.upgrading = false;
            creep.memory.requestingEnergy = true;
            creep.say('🔄 harvest');
	    }
        //IF UPGRADING & FULL
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
	        creep.memory.upgrading = true;
            creep.memory.requestingEnergy = false;
	        creep.say('⚡ upgrade');
	    }
        //IF UPGRADING
	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        //IF UPGRADING NOT IN MEMORY
        if(creep.memory.upgrading === undefined){
            creep.memory.upgrading = false;
        }
        // IF NOT UPGRADING AND INVENTORY NOT FULL ->
        if(!creep.memory.upgrading && creep.store.getFreeCapacity([RESOURCE_ENERGY]) != 0) {
            // IF CONTAINERS PRESENT -> COLLECT FROM CONTAINER
            if(containers.length > 0){
                
                if(creep.withdraw(closest_container,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(closest_container);
                }
            }
            // IF NO CONTAINER -> REQUEST PICKUP IF MULES IN ROOM
            else if(mulesInRoom.length > 0){
                creep.memory.requestingEnergy = true;
            }
            //IF NO MULES -> HARVEST SOURCE
            else if(mulesInRoom.length === 0){
                sources = creep.room.find(FIND_SOURCES_ACTIVE);
                if(creep.harvest(sources[0]) === ERR_NOT_IN_RANGE){
                    creep.moveTo(sources[0]);
                }
            }
        }
	}
};

module.exports = roleUpgrader;