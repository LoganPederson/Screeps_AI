var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {

        //SOURCE SERIALIZATION LOGIC
        if(creep.spawning === false){ // do we need this?   
            const roomSources = creep.room.memory.sources;

            let serializedSources = [];
            var i = 0;
            for(let everySource in roomSources){
                serializedSources.push(Game.getObjectById(roomSources[i]))
                var i = i+1;
            }
            // console.log('serializedSources: ' + serializedSources);
            let closestSource = creep.pos.findClosestByPath(serializedSources);
            let assignedMiners = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role === 'miner' && creep.memory.creepRoom === creep.room.name && creep.memory.sourceTarget);
            // console.log('assignedMiners: ' + assignedMiners);
            // .map returns an array doing the specified function to each in the array, in this case returns the array back with only the values returning true for not containing an assigned source's id
            let assignedSources = assignedMiners.map(c => c.memory.sourceTarget);
            // console.log('assignedSources: ' + assignedSources);
            let freeSources = roomSources.filter(id => !_.contains(assignedSources, id));
            // console.log('freeSources: ' + freeSources);
            serializedFreeSources = [];
            var b = 0;
            for(let everySource in freeSources){
                serializedFreeSources.push(Game.getObjectById(freeSources[b]))
                var b = b+1;
            }
            let closestAvailableSource = creep.pos.findClosestByPath(serializedFreeSources);
            var miners = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role === 'miner');
            // console.log('sourceTarget = ' + creep.memory.sourceTarget);
            if(creep.memory.sourceTarget == undefined){
                console.log('bet this prints')
                if(closestAvailableSource){
                    // console.log("closest source to miner is: "+closestSource);
                    creep.memory.sourceTarget = closestAvailableSource.id;
                }
            }
            var creepsInRoomArray = creep.room.find(FIND_MY_CREEPS);
            var mulesInRoom = _.filter(creepsInRoomArray, (creep) => creep.memory.role == 'mule' || creep.memory.role === 'mule2');
            var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
            var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
            var closestContainer = creep.pos.findClosestByPath(containers);
            var closestSpawnInRoom = _.filter(creep.room.find(FIND_MY_STRUCTURES) , (s) => s.structureType === STRUCTURE_SPAWN);
            //IF mulesInRoom
            if(mulesInRoom.length > 0){
                //IF REQUESTIN && creep.memory.creepRoom === creep.room.nameG PICKUP BUT INVENTORY  && creep.memory.creepRoom === creep.room.nameEMPTY -> START MINING
                if(creep.memory.requestingPickup && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                    creep.memory.requestingPickup = false;
                    creep.say('Mining');
                }
                //IF NOT MINING BUT INVENTORY FULL -> REQUEST PICKUP
                if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
                    creep.memory.requestingPickup = true;
                    creep.say('Requesting Pickup');
                }
                
                //IF NO CONTAINERS -> REQUEST MULE PICKUP
                if(creep.memory.requestingPickup && containers.length === 0){
                    var pickupTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: { memory: { role: 'mule2' } }
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
                if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) === 0) {
                    creep.memory.requestingPickup = true;
                    creep.say('Requesting Pickup')
                    delete creep.memory.sourceTarget;
                }
            }
            // NO mulesInRoom IN ROOM 
            else{
                if(creep.memory.requestingPickup && creep.memory.creepRoom === creep.room.name && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0) {
                    creep.memory.requestingPickup = false;
                    creep.say('Mining')
                    
                }
                if(!creep.memory.requestingPickup && creep.store.getFreeCapacity([RESOURCE_ENERGY]) == 0) {
                    creep.memory.requestingPickup = true;
                    creep.say('Requesting Pickup')
                }
                
                    // Targets that require filling
                if(creep.memory.requestingPickup === true){
                    // console.log("Miner requestingPickup true")
                    var closestSpawnInRoom = creep.pos.findClosestByPath(_.filter(creep.room.find(FIND_MY_STRUCTURES),(s) => s.structureType === STRUCTURE_SPAWN)).name
                    // console.log(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY));
                    // console.log(creep.transfer(closestSpawnInRoom, RESOURCE_ENERGY))
                    if(creep.transfer(Game.spawns[closestSpawnInRoom], RESOURCE_ENERGY)===ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.spawns[closestSpawnInRoom]);
                    }
                }
                else if(creep.memory.requestingPickup === true && containers.length > 0 && Game.spawns[closestSpawnInRoom].store.getUsedCapacity([RESOURCE_ENERGY]) === 300){
                    let closestContainerNotFull = creep.pos.findClosestByPath(_.filter(containers, (c) => c.store.getUsedCapacity([RESOURCE_ENERGY]) != c.store.getCapacity([RESOURCE_ENERGY])));
                    // console.log(closestContainerNotFull + " closset container not full, spawn full and no mules")
                }
                else if(creep.memory.requestingPickup === false) {

                    if(creep.harvest(closestAvailableSource == ERR_NOT_IN_RANGE)){
                        creep.moveTo(Game.getObjectById(creep.memory.sourceTarget));
                        creep.harvest(Game.getObjectById(creep.memory.sourceTarget));
                    }
                }
                if(!creep.memory.requestingPickup && creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                    creep.memory.requestingPickup = false;
                    creep.say('Mining');
                }
            }
        }
    }
};

module.exports = roleMiner;