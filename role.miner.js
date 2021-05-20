var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //SOURCE SERIALIZATION LOGIC
        if(creep.spawning === false){
            const roomSources = creep.room.memory.sources;

            let serializedSources = [];
            var i = 0;
            for(let everySource in roomSources){
                serializedSources.push(Game.getObjectById(roomSources[i]))
                var i = i+1;
            }
            let closestSource = creep.pos.findClosestByPath(serializedSources);
            let assignedMiners = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role === 'miner' && creep.memory.creepRoom === creep.room.name && creep.memory.sourceTarget);
            let assignedSources = assignedMiners.map(c => c.memory.sourceTarget);
            let freeSources = roomSources.filter(id => !_.contains(assignedSources, id));
            serializedFreeSources = [];
            var b = 0;
            for(let everySource in freeSources){
                serializedFreeSources.push(Game.getObjectById(freeSources[b]))
                var b = b+1;
            }

            let closestAvailableSource = creep.pos.findClosestByPath(serializedFreeSources);
            var miners = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role === 'miner');
            if(!creep.memory.sourceTarget){
                if(roomSources.length > 1 && miners.length > 0 && serializedFreeSources.length > 0 && closestAvailableSource){
                    creep.memory.sourceTarget = closestAvailableSource.id;  
                }
                else{
                    creep.memory.sourceTarget = closestSource.id;
                }
            }
            var creepsInRoomArray = creep.room.find(FIND_MY_CREEPS)
            var mulesInRoom = _.filter(creepsInRoomArray, (creep) => creep.memory.role == 'mule');
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
            var closestContainer = creep.pos.findClosestByPath(containers);
            
            //IF mulesInRoom
            if(mulesInRoom.length > 0){
                //IF REQUESTIN && creep.memory.creepRoom === creep.room.nameG PICKUP BUT INVENTORY  && creep.memory.creepRoom === creep.room.nameEMPTY -> START MINING
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
                    //var containerTarget = _.filter(creep.pos.findClosestByRange(FIND_STRUCTURES), (s) => s.structureType == STRUCTURE_CONTAINER);
                    creep.transfer(pickupTarget, RESOURCE_ENERGY);
                }
                //IF CONTAINER(S) PRESENT -> DROP INTO CONTAINER
                else if(creep.memory.requestingPickup && containers.length > 0){
                    if(creep.transfer(closestContainer,RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(closestContainer);
                    }
                }
                // Choose Source and Harvest
                if(!creep.memory.requestingPickup) {
                    var targetSource = Game.getObjectById(creep.memory.sourceTarget);
                    if(creep.harvest(targetSource) == ERR_NOT_IN_RANGE){
                        creep.moveTo(targetSource);
                    }
                }
                if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                    creep.memory.requestingPickup = true;
                    creep.say('Requesting Pickup')
                    delete creep.memory.sourceTarget;
                }
            }
            
            // NO mulesInRoom IN ROOM 
            else{
                if(creep.memory.requestingPickup && creep.memory.creepRoom === creep.room.name && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0) {
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
                else if(creep.memory.requestingPickup === false) {

                    if(creep.harvest(closestAvailableSource == ERR_NOT_IN_RANGE)){
                        creep.moveTo(Game.getObjectById(creep.memory.sourceTarget));
                        creep.harvest(Game.getObjectById(creep.memory.sourceTarget));
                    }
                }
                if(!creep.memory.requestingPickup && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                    creep.memory.requestingPickup = false;
                    creep.say('Mining');
                }
            }
        }
    }
};

module.exports = roleMiner;