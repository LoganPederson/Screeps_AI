var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // Storing sources to memory by ID and finding closest 
        var availableSources = creep.room.memory.sources;
        var serializedSources = []
        var i = 0;
        var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        for(let everySource in availableSources){
            serializedSources.push(Game.getObjectById(availableSources[i]))
            var i = i+1;
        }
        var closestSource = creep.pos.findClosestByPath(serializedSources);
        
        //Finding closest construction site
        
        //Make sure we didn't get lost
        if(creep.memory.creepRoom){
            // If Building & no energy -> Stop Building
    	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
    	    }
    	    // If Not building && full of energy -> start building!
    	    if(!creep.memory.building && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && targets.length > 0) {
    	        creep.memory.building = true;
    	        creep.say('🚧 build');
    	    }
    	    // If building && not out of energy && no build jobs to do -> Repair
    	    if(creep.memory.building && !creep.store[RESOURCE_ENERGY] == 0 && creep.room.find(FIND_CONSTRUCTION_SITES).length == 0) {
    	        var repair_target = creep.room.find(FIND_MY_STRUCTURES, {
    	            filter: (structure) => {
    	                return(structure.hits < structure.hitsMax);
    	            }
    	        });
    	        
    	        if(creep.repair(repair_target[0]) == ERR_NOT_IN_RANGE){
    	            creep.moveTo(repair_target[0]);
    	        }
    	    }
            // If Building
    	    if(creep.memory.building) {
                if(targets.length > 0) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        //console.log(targets.length);
                    }
                }
                if(targets.length == 0){
                    creep.memory.building = false;
                }
    	    }
    	    // if !building
    	    else {
    	        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getCapacity(RESOURCE_ENERGY)){
        	        var sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestSource, {visualizePathStyle: {stroke: '#ffaa00'}});
                        creep.harvest(closestSource);
                    }
    	        }
    	        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)){
    	            creep.moveTo(29,29);
    	        }
    	    }
        }
        else{
            creep.memory.targetRoom = 'W32N56';
            creep.memory.building = 'false';
            console.log('Creep in wrong room!')
            console.log('Creep.room == '+ creep.room + ' Creep.memory.creepRoom ==' + creep.memory.creepRoom);
            creep.store.getUsedCapacity(RESOURCE_ENERGY)
        }
	}
};

module.exports = roleBuilder;