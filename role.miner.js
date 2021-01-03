var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        // Logic behind Serializing Sources for assignment based on range
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
            if(sourceMiners.length >= 1){
                nextSource = serializedSources;
                nextSource.shift();
                nextClosestSource = creep.pos.findClosestByPath(nextSource);
                creep.memory.sourceTarget = nextClosestSource.id;    
            }
            else{
                creep.memory.sourceTarget = closestSource.id
            }
        }
        
        // Number of creeps with role mule, use mule.length
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        
        if(mules.length > 0){
            // If filling and no energy left, turn off filling
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
                var pickupTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: { memory: { role: 'mule' } }
                });
                creep.transfer(pickupTarget,RESOURCE_ENERGY);
            }
            // Choose Source and Harvest
            else {
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
        
        // if no mules
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