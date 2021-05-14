var roleMule = {
    run: function(creep) {
        


        //VARIABLES
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var requestingCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return(creep.memory.requestingPickup == true);
            }
        });
        

        var notFullStructures = _.filter(creep.room.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER);
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) != 0);
        // IF CONTAINERS IN ROOM -> 
        if(containers.length > 0){
            var closest_container = creep.pos.findClosestByPath(containers);
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
                
                var closest_container = creep.pos.findClosestByPath(containers);
                var muleDuplicateTargets = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closest_container)) == closest_container);
                var memory_closest_container = Game.getObjectById(creep.memory.closest_container);

                //IF NO CLOSEST PICKUP IN MEMORY BUT STRUCTURES NEED ENERGY -> SET MEMORY
                if((!creep.memory.closest_container || creep.memory.closest_container === undefined) && notFullStructures.length != 0){
                    creep.memory.closest_container = closest_container.id;   
                }
                //IF CREEP HAS closest_container IN MEMORY
                else if(creep.memory.closest_container){
                    //IF LESS STRUCTURES REQUESTING THAN MULES
                    if(notFullStructures.length < mules.length){
                        //IF MORE THAN JUST THIS MULE WITH SAME CLOSEST PICKUP -> SHIFT ARRAY??
                        if(muleDuplicateTargets.length > 1){
                            nextTarget = notFullStructures;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closest_container = nextClosestTarget.id;    
                        }
                    }
                    //IF MORE STRUCTURES REQUESTING THAN MULES
                    else{
                        //IF CONTAINER NEARBY IS SET
                        if(closest_container){
                            // var closestMule = closest_container.pos.findClosestByPath(muleDuplicateTargets);
                            // if(creep.memory.closest_container){
                            //     if(creep.withdraw(memory_closest_container, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE){
                            //         creep.moveTo(memory_closest_container);
                            //     }
                            // }
                            // else{
                            //     creep.memory.closest_container = '';
                            // }
                            if(creep.memory.closest_container != closest_container.id){
                                creep.memory.closest_container = closest_container.id;
                            }
                            if(creep.withdraw(memory_closest_container, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE){
                                creep.moveTo(memory_closest_container);
                            }
                        }
                    }
                }
            }
            //IF NOT COLLECTING
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)  && structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0)
                    }
                });
                if(targets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0) {
                    
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if(targets.length === 0){
                    creep.moveTo(34,25);
                    
                }
            }
        }
        //IF NO CONTAINERS IN ROOM -> CHANGE closest_container TO BE CREEPS NOT CONTAINERS 
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
                
                var closest_container = creep.pos.findClosestByPath(requestingCreeps);
                var muleDuplicateTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closest_container)) == closest_container);
                var memory_closest_container = Game.getObjectById(creep.memory.closest_container);
                //IF NO CLOSEST PICKUP IN MEMORY BUT CREEPS REQUESTING -> SET MEMORY
                if(!creep.memory.closest_container && requestingCreeps.length != 0){
                    //IF OTHER MULE HAS SAME TARGET SET, CHOOSE FURTHER TARGET TO MEMORY
                    if(muleDuplicateTargets.length > 1){
                        nextTarget = requestingCreeps;
                        nextTarget.splice(closest_container, nextTarget[1]);
                        if(creep.pos.findClosestByPath(nextTarget) != null){
                            nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                            creep.memory.closest_container = nextClosestTarget.id;
                        }
                        else{
                            creep.say("Can't Reach or No Creeps!");
                        }
                    }
                    //IF NO DUPLICATE MULE TARGETS, SET CLOSEST PICKUP TO MEMORY
                    else{
                        if(closest_container){
                            creep.memory.closest_container = closest_container.id;
                        }
                    }
                }
                //IF CREEP HAS closest_container IN MEMORY
                else{
                    if(requestingCreeps.length > mules.length){
                        if(muleDuplicateTargets.length > 1){
                            nextTarget = requestingCreeps;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closest_container = nextClosestTarget.id;    
                        }
                    }
                    else{
                        if(closest_container){
                            var closestMule = closest_container.pos.findClosestByPath(muleDuplicateTargets);
                            if (closestMule && creep.name == closestMule.name){
                                if(creep.transfer(memory_closest_container, RESOURCE_ENERGY,0) == ERR_NOT_IN_RANGE){
                                    creep.moveTo(memory_closest_container);
                                }
                            }
                            else{
                                creep.memory.closest_container = '';
                            }
                        }
                        else{
                            creep.memory.collecting = false; 
                        }
                    }
                }
            }
            //IF NOT COLLECTING
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)  && structure.store.getFreeCapacity(RESOURCE_ENERGY) != 0)
                    }
                });
                if(targets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0) {
                    
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if(requestingCreeps.length === 0){
                    creep.moveTo(34,25);
                    
                }
            }
        }
    }
}


module.exports = roleMule;