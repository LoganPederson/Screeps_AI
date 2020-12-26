var roleRepair = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // Storing sources to memory by ID and finding closest 
        var availableSources = creep.room.memory.sources;
        var serializedSources = []
        var i = 0;
        var targets = creep.room.find(FIND_MY_STRUCTURES);
        for(let everySource in availableSources){
            serializedSources.push(Game.getObjectById(availableSources[i]))
            var i = i+1;
        }
        var closestSource = creep.pos.findClosestByPath(serializedSources);
        var repair_target = creep.room.find(FIND_STRUCTURES, {
    	            filter: (structure) => {
    	                return(structure.hits <= (structure.hitsMax *0.9) && structure.structureType === STRUCTURE_ROAD || structure.structureType === STRUCTURE_TOWER);
    	            }
    	        })
    	var closest_repair = creep.pos.findClosestByPath(repair_target);
    	var memory_repairTarget = Game.getObjectById(creep.memory.repairTarget);
        //Finding closest construction site
        
        //Make sure we didn't get lost
        if(creep.memory.creepRoom){
            // If repairing & no energy -> Stop repairing
    	    if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.repairing = false;
                creep.say('🔄 harvest');
    	    }
    	    // If Not repairing && full of energy -> start repairing!
    	    if(!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && repair_target.length > 0) {
    	        creep.memory.repairing = true;
    	        creep.say('🚧 repair');
    	    }
    	    
            // If repairing
    	    if(creep.memory.repairing) {
    	        // If repairTarget exists in memory
                if(creep.memory.repairTarget) {
                    if(creep.repair(memory_repairTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(memory_repairTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                        //console.log('Moving To ' + memory_repairTarget);
                    }
                    else{
                        creep.repair(memory_repairTarget);
                    }
                    if(memory_repairTarget.hits > (memory_repairTarget.hitsMax * 0.95)){
                        if(repair_target.length > 0){
                            creep.memory.repairTarget = closest_repair.id;
                        }
                        else{
                            creep.moveTo(35,29);
                        }
                    }
                }
                // If repairTarget not in memory, set it
                else{
                    console.log(closest_repair);
                    creep.memory.repairTarget = closest_repair.id;
                }
                // If no buildings with hp < 80% stop repairing
                if(repair_target.length == 0){
                    creep.memory.repairing = false;
                }
    	    }
    	    // if !repairing
    	    else {
    	        // If inventory not empty -> Go fill it
    	        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY)){
        	        var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                        creep.harvest(closestSource);
                    }
    	        }
    	        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)){
    	            creep.moveTo(35,29);
    	        }
    	    }
        }
        // For accidental room change ~ Not implemented yet
        else{
            creep.memory.targetRoom = 'W32N56';
            creep.memory.repairing = 'false';
            console.log('Creep in wrong room!')
            console.log('Creep.room == '+ creep.room + ' Creep.memory.creepRoom ==' + creep.memory.creepRoom);
        }
	}
};

module.exports = roleRepair;