var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        //SOURCE SERIALIZATION LOGIC
        var availableSources = creep.room.memory.sources;
        var serializedSources = []
        var i = 0;
        for(let everySource in availableSources){
            serializedSources.push(Game.getObjectById(availableSources[i]))
            var i = i+1;
        }
        var closestSource = creep.pos.findClosestByPath(serializedSources);
        var sourceMiners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && (Game.getObjectById(creep.memory.sourceTarget)) == closestSource);
        
        
        if(!creep.memory.sourceTarget){
            if(sourceMiners.length > 0){
                nextSource = serializedSources;
                nextSource.pop();
                nextClosestSource = creep.pos.findClosestByPath(nextSource);
                creep.memory.sourceTarget = nextClosestSource.id;    
            }
            else{
                creep.memory.sourceTarget = closestSource.id
            }
        }
        
        //VARIABLES
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
        var closest_container = creep.pos.findClosestByPath(containers);
        
        if(mules.length > 0){
            //IF REQUESTING PICKUP BUT INVENTORY EMPTY -> START MINING
    	    if(creep.memory.requestingPickup && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = false;
                creep.say('Mining')
            }
            //IF NOT MINING BUT INVENTORY FULL -> REQUEST PICKUP
            if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = true;
                creep.say('Requesting Pickup')
            }
            
            //IF NO CONTAINERS -> REQUEST MULE PICKUP
            if(creep.memory.requestingPickup && containers.length === 0){
                var pickupTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: { memory: { role: 'mule' } }
                });
                var containerTarget = _.filter(creep.pos.findClosestByRange(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER);
                if(creep.transfer(containerTarget,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(containerTarget)
                }
                else {
                    creep.transfer(pickupTarget, RESOURCE_ENERGY);
                }
            }
            //IF CONTAINER(S) PRESENT -> DROP INTO CONTAINER
            else if(creep.memory.requestingPickup && containers.length > 0){
                if(creep.transfer(closest_container,RESOURCE_ENERGY,50) === ERR_NOT_IN_RANGE){
                    creep.moveTo(closest_container);
                }
            }
            // Choose Source and Harvest
            if(!creep.memory.requestingPickup) {
                var listSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
                var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
                var targetSource = Game.getObjectById(creep.memory.sourceTarget);
                if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE){
                    creep.moveTo(targetSource);
                }
            }
            if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = true;
                creep.say('Requesting Pickup')
            }
        }
        
        // NO MULES IN ROOM LOGIC
        else {
            // var availableSources = creep.room.memory.sources;
            // var serializedSources = []
            // var i = 0;
            // for(let everySource in availableSources){
            //     serializedSources.push(Game.getObjectById(availableSources[i]))
            //     var i = i+1;
            // }
            //console.log(serializedSources);
            //console.log('Available Sources: '+availableSources);
            if(creep.memory.requestingPickup && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = false;
                creep.say('Mining')
            }
            if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = true;
                creep.say('Requesting Pickup')
            }
            
                // Targets that require filling
            if(creep.memory.requestingPickup){
                if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY)==ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns['Spawn1']);
                }
            }
            else {
                if(creep.harvest(closestSource == ERR_NOT_IN_RANGE)){
                    creep.moveTo(closestSource);
                    creep.harvest(closestSource)
                }
            }
            if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                creep.memory.requestingPickup = true;
                creep.say('Requesting Pickup')
            }
        }
    }
};

module.exports = roleMiner;