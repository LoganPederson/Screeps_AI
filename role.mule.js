var roleMule = {
    run: function(creep) {
        


        //VARIABLES
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var requestingCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return(creep.memory.requestingPickup === true);
            }
        });
        var creepsRequestingEnergy = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return(creep.memory.requestingEnergy === true);
            }
        });

        var fillingTargets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)  && structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0)
            }
        });

        var notFullStructures = _.filter(creep.room.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER);
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) != 0);
        // IF CONTAINERS IN ROOM -> 
        if(containers.length > 0){
            var closestContainer = creep.pos.findClosestByPath(containers);
            //IF NOT COLLECTING AND INVENTORY EMPTY -> COLLECT
            if(!creep.memory.collecting && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
                creep.memory.collecting = true;
            }
            //IF COLLECTING AND INVENTORY FULL -> STOP COLLECTING
            if(creep.memory.collecting && creep.store.getFreeCapacity([RESOURCE_ENERGY])==0){
                creep.memory.collecting = false;
            }
            
            
            
            //IF COLLECTING
            if(creep.memory.collecting) {
                // requestingCreeps = array of creeps with requestingPickup = true
                
                var closestContainer = creep.pos.findClosestByPath(containers);
                var muleDuplicatefillingTargets = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestContainer)) == closestContainer);
                var memory_closestContainer = Game.getObjectById(creep.memory.closestContainer);

                //IF NO CLOSEST PICKUP IN MEMORY BUT STRUCTURES NEED ENERGY -> SET MEMORY
                if((!creep.memory.closestContainer || creep.memory.closestContainer === undefined) && notFullStructures.length != 0){
                    creep.memory.closestContainer = closestContainer.id;   
                }
                //IF CREEP HAS closestContainer IN MEMORY
                else if(creep.memory.closestContainer){
                    //IF LESS STRUCTURES REQUESTING THAN MULES
                    if(notFullStructures.length < mules.length){
                        //IF MORE THAN JUST THIS MULE WITH SAME CLOSEST PICKUP -> SHIFT ARRAY??
                        if(muleDuplicatefillingTargets.length > 1){
                            nextTarget = notFullStructures;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closestContainer = nextClosestTarget.id;    
                        }
                    }
                    //IF MORE STRUCTURES REQUESTING THAN MULES
                    else{
                        //IF CONTAINER NEARBY IS SET
                        if(closestContainer){
                            if(creep.memory.closestContainer != closestContainer.id){
                                creep.memory.closestContainer = closestContainer.id;
                            }
                            if(creep.withdraw(memory_closestContainer, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE){
                                creep.moveTo(memory_closestContainer);
                            }
                        }
                    }
                }
            }
            //IF NOT COLLECTING
            else{
                console.log("TESTING 80 MULE MULE NOT COLLECTING BUT CONTAINERS IN ROOM")
                var closestRequestingEnergy = creep.pos.findClosestByPath(creepsRequestingEnergy);
                var muleDuplicatefillingTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestRequestingEnergy)) == closestContainer);
                var memory_closestRequestingEnergy = Game.getObjectById(creep.memory.closestRequestingEnergy);
                
                //IF CLOSESTREQUESTINGENERGY NOT SET -> SET IT
                if((!creep.memory.closestRequestingEnergy || creep.memory.closestRequestingEnergy === undefined) && creepsRequestingEnergy.length != 0){
                    creep.memory.closestRequestingEnergy = closestRequestingEnergy.id
                }
                //IF OTHER MULE HAS SAME TARGET SET && MORE REQUESTING ENERGY THAN MULES -> CHOOSE FURTHER TARGET TO MEMORY
                if(muleDuplicatefillingTargets.length > 1 && creepsRequestingEnergy.length > mules.length){
                    nextTarget = creepsRequestingEnergy;
                    nextTarget.splice(creepsRequestingEnergy, nextTarget[1]);
                    if(creep.pos.findClosestByPath(nextTarget) != null){
                        nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                        creep.memory.closestRequestingEnergy = nextClosestTarget.id;
                    }
                    else{
                        creep.say("Can't Reach or No Creeps!");
                    }
                }
                //IF NO DUPLICATE MULE fillingTargets, OR LESS REQUESTING ENERGY THAN MULES
                else{
                    //IF ANY CREEP IS REQUESTING ENERGY
                    if(closestRequestingEnergy){
                        //CLOSEST REQUESTING ENERGY BECOMES TARGET
                        creep.memory.closestRequestingEnergy = closestRequestingEnergy.id;
                    }
                }
                //IF BUILDINGS NEED ENERGY AND CREEP HAS SOME -> MOVE TO AND FILL
                if(fillingTargets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0 && creepsRequestingEnergy.length === 0) {
                    if(creep.transfer(fillingTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fillingTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //IF NO BUILDINGS NEED ENERGY NOR CREEPS
                else if(requestingCreeps.length === 0 && creepsRequestingEnergy.length === 0){
                    creep.moveTo(34,25);
                }
            }
        }
        //IF NO CONTAINERS IN ROOM 
        else{
            //IF NOT COLLECTING AND INVENTORY EMPTY -> COLLECT
            if(!creep.memory.collecting && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
                creep.memory.collecting = true;
            }
            //IF COLLECTING AND INVENTORY FULL -> STOP COLLECTING
            if(creep.memory.collecting && creep.store.getFreeCapacity([RESOURCE_ENERGY])==0){
                creep.memory.collecting = false;
            }
            
            //IF COLLECTING
            if(creep.memory.collecting) {
                // requestingCreeps = array of creeps with requestingPickup = true
                
                var closestRequesting = creep.pos.findClosestByPath(requestingCreeps);
                var muleDuplicatefillingTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestRequesting)) == closestRequesting);
                var memory_closestRequesting = Game.getObjectById(creep.memory.closestRequesting);
                //IF NO CLOSEST REQUESTING IN MEMORY BUT CREEPS REQUESTING -> SET MEMORY
                if(!creep.memory.closestRequesting && requestingCreeps.length != 0){
                    //IF OTHER MULE HAS SAME TARGET SET, CHOOSE FURTHER TARGET TO MEMORY
                    if(muleDuplicatefillingTargets.length > 1){
                        nextTarget = requestingCreeps;
                        nextTarget.splice(requestingCreeps, nextTarget[1]);
                        if(creep.pos.findClosestByPath(nextTarget) != null){
                            nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                            creep.memory.closestRequesting = nextClosestTarget.id;
                        }
                        else{
                            creep.say("Can't Reach or No Creeps!");
                        }
                    }
                    //IF NO DUPLICATE MULE fillingTargets, SET CLOSEST REQUESTING CREEP TO MEMORY
                    else{
                        if(closestRequesting){
                            creep.memory.closestRequesting = closestRequesting.id;
                        }
                    }
                }
                //IF CREEP HAS closestRequesting IN MEMORY
                else{
                    //IF MORE REQUESTING THAN MULES
                    if(requestingCreeps.length > mules.length){
                        //IF MULES HAVE THE SAME TARGET -> CHANGE fillingTargets
                        if(muleDuplicatefillingTargets.length > 1){
                            nextTarget = requestingCreeps;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closestRequesting = closestRequesting.id;    
                        }
                        //GO FILL TARGET
                        if(creep.transfer(memory_closestRequesting, RESOURCE_ENERGY, 0) === ERR_NOT_IN_RANGE){
                            creep.moveTo(memory_closestRequesting);
                        }
                    }
                    //IF MORE MULES THAN REQUESTERS
                    else{
                        //IF ANY REQUESTING
                        if(closestRequesting){
                            let closestMule = closestRequesting.pos.findClosestByPath(mules);
                            //IF CLOSEST MULE TO REQUESTER IS THIS CREEP
                            if (closestMule && creep.name === closestMule.name){
                                if(creep.transfer(memory_closestRequesting, RESOURCE_ENERGY, 0) === ERR_NOT_IN_RANGE){
                                    creep.moveTo(memory_closestRequesting);
                                }
                            }
                            else{
                                creep.memory.closestRequesting = '';
                                console.log("Not closest to creep but more mules than requesting")
                            }
                        }
                        else{
                            creep.memory.collecting = false; 
                        }
                    }
                }
            }
            //IF NOT COLLECTING && NO CONTAINERS IN ROOM
            else{

                var closestRequestingEnergy = creep.pos.findClosestByPath(creepsRequestingEnergy);
                var muleDuplicatefillingTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestRequestingEnergy)) == closestContainer);
                var memory_closestRequestingEnergy = Game.getObjectById(creep.memory.closestRequestingEnergy);
                
                //LOSE CLOSEST REQUESTING TARGET TO PREVENT DUPLICATE MULES NOT REALLY ASSIGNED
                creep.memory.closestRequesting = '';

                //IF CLOSESTREQUESTINGENERGY NOT SET -> SET IT
                if((!creep.memory.closestRequestingEnergy || creep.memory.closestRequestingEnergy === undefined) && creepsRequestingEnergy.length != 0){
                    creep.memory.closestRequestingEnergy = closestRequestingEnergy.id
                }
                //IF OTHER MULE HAS SAME TARGET SET && MORE REQUESTING ENERGY THAN MULES -> CHOOSE FURTHER TARGET TO MEMORY
                if(muleDuplicatefillingTargets.length > 1 && creepsRequestingEnergy.length > mules.length){
                    nextTarget = creepsRequestingEnergy;
                    nextTarget.splice(creepsRequestingEnergy, nextTarget[1]);
                    if(creep.pos.findClosestByPath(nextTarget) != null){
                        nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                        creep.memory.closestRequestingEnergy = nextClosestTarget.id;
                    }
                    else{
                        creep.say("Can't Reach or No Creeps! 219");
                    }
                }
                //IF NO DUPLICATE MULE fillingTargets, OR LESS REQUESTING ENERGY THAN MULES
                else{
                    //IF ANY CREEP IS REQUESTING ENERGY
                    if(closestRequestingEnergy){
                        //CLOSEST REQUESTING ENERGY BECOMES TARGET
                        creep.memory.closestRequestingEnergy = closestRequestingEnergy.id;
                        if(creep.transfer(Game.getObjectById(creep.memory.closestRequestingEnergy), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.closestRequestingEnergy), {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                //IF BUILDINGS NEED ENERGY AND CREEP HAS SOME -> MOVE TO AND FILL
                if(fillingTargets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0 && creepsRequestingEnergy.length === 0) {
                    if(creep.transfer(fillingTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fillingTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //IF NO BUILDINGS NEED ENERGY NOR CREEPS
                else if(requestingCreeps.length === 0 && creepsRequestingEnergy.length === 0){
                    creep.moveTo(34,25);
                }  
            }
        }
    }
}


module.exports = roleMule;