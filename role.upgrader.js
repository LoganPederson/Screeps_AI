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
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() != 0) {
            var availableSources = creep.room.memory.sources;
            var serializedSources = []
            var i = 0;
            for(let everySource in availableSources){
                serializedSources.push(Game.getObjectById(availableSources[i]))
                var i = i+1;
            }
            var closestSource = creep.pos.findClosestByPath(serializedSources);
            if(creep.harvest((closestSource) == ERR_NOT_IN_RANGE)) {
                creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            if(creep.harvest(closestSource) != ERR_NOT_IN_RANGE){
                creep.harvest(closestSource);
            }
        }
	}
};

module.exports = roleUpgrader;