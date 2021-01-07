var roleExpansionBuilder = {

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
        
        //VARIABLES
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) != 0);
        var closest_container = creep.pos.findClosestByPath(containers);
        var blueFlags = _.filter(Game.flags, (f) => f.color === COLOR_BLUE);
        var blueFlag = blueFlags[0];
        var yellowFlags = _.filter(Game.flags, (f) => f.color === COLOR_YELLOW);
        var yellowFlag = yellowFlags[0];
        
        //Make sure we didn't get lost
        if(creep.memory.correctRoom){
            
            
            //IF SPAWN BUILT -> SET ROLE BUILDER
            if(creep.room.find(FIND_MY_SPAWNS).length > 0){
                creep.memory.role = 'builder';
                console.log(creep.name+' has detected spawn is built in expansion room and is converting to role: builder');
            }
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
                    if(creep.harvest(creep.pos.findClosestByPath(sources)) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.pos.findClosestByPath(sources));
                    }
    	        }
    	        if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == creep.store.getCapacity(RESOURCE_ENERGY)){
    	            creep.moveTo(29,29);
    	        }
    	    }
        }
        // IF NO correctRoom in memory yet -> Go To Yellow Flag
        else if (yellowFlags.length>0){
            creep.moveTo(yellowFlag);
            //IF ON YELLOW FLAG -> SET correctRoom
            if(creep.pos.x === yellowFlag.pos.x && creep.pos.y === yellowFlag.pos.y){
            creep.memory.correctRoom = true;
        }
        else{
            creep.suicide();
        }
        }
	}
};

module.exports = roleExpansionBuilder;