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
                
                var closestPickup = creep.pos.findClosestByPath(containers);
                var muleDuplicateTargets = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestPickup)) == closestPickup);
                var memory_closestPickup = Game.getObjectById(creep.memory.closestPickup);

                //IF NO CLOSEST PICKUP IN MEMORY BUT STRUCTURES NEED ENERGY -> SET MEMORY
                if((!creep.memory.closestPickup || creep.memory.closestPickup === undefined) && notFullStructures.length != 0){
                    creep.memory.closestPickup = closestPickup.id;   
                }
                //IF CREEP HAS CLOSESTPICKUP IN MEMORY
                else if(creep.memory.closestPickup){
                    //IF LESS STRUCTURES REQUESTING THAN MULES
                    if(notFullStructures.length < mules.length){
                        //IF MORE THAN JUST THIS MULE WITH SAME CLOSEST PICKUP -> SHIFT ARRAY??
                        if(muleDuplicateTargets.length > 1){
                            nextTarget = notFullStructures;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closestPickup = nextClosestTarget.id;    
                        }
                    }
                    //IF MORE STRUCTURES REQUESTING THAN MULES
                    else{
                        //IF CONTAINER NEARBY IS SET
                        if(closestPickup){
                            // var closestMule = closestPickup.pos.findClosestByPath(muleDuplicateTargets);
                            // if(creep.memory.closestPickup){
                            //     if(creep.withdraw(memory_closestPickup, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE){
                            //         creep.moveTo(memory_closestPickup);
                            //     }
                            // }
                            // else{
                            //     creep.memory.closestPickup = '';
                            // }
                            if(creep.memory.closestPickup != closestPickup.id){
                                creep.memory.closestPickup = closestPickup.id;
                            }
                            if(creep.withdraw(memory_closestPickup, RESOURCE_ENERGY,) == ERR_NOT_IN_RANGE){
                                creep.moveTo(memory_closestPickup);
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
        //IF NO CONTAINERS IN ROOM -> CHANGE closestPickup TO BE CREEPS NOT CONTAINERS 
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
                
                var closestPickup = creep.pos.findClosestByPath(requestingCreeps);
                var muleDuplicateTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestPickup)) == closestPickup);
                var memory_closestPickup = Game.getObjectById(creep.memory.closestPickup);
                //IF NO CLOSEST PICKUP IN MEMORY BUT CREEPS REQUESTING -> SET MEMORY
                if(!creep.memory.closestPickup && requestingCreeps.length != 0){
                    //IF OTHER MULE HAS SAME TARGET SET, CHOOSE FURTHER TARGET TO MEMORY
                    if(muleDuplicateTargets.length > 1){
                        nextTarget = requestingCreeps;
                        nextTarget.splice(closestPickup, nextTarget[1]);
                        nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                        creep.memory.closestPickup = nextClosestTarget.id;
                    }
                    //IF NO DUPLICATE MULE TARGETS, SET CLOSEST PICKUP TO MEMORY
                    else{
                        creep.memory.closestPickup = closestPickup.id;
                    }
                }
                //IF CREEP HAS CLOSESTPICKUP IN MEMORY
                else{
                    if(requestingCreeps.length > mules.length){
                        if(muleDuplicateTargets.length > 1){
                            nextTarget = requestingCreeps;
                            nextTarget.shift();
                            nextClosestTarget = nextTarget[0];
                            creep.memory.closestPickup = nextClosestTarget.id;    
                        }
                    }
                    else{
                        if(closestPickup){
                            var closestMule = closestPickup.pos.findClosestByPath(muleDuplicateTargets);
                            if (closestMule && creep.name == closestMule.name){
                                if(creep.transfer(memory_closestPickup, RESOURCE_ENERGY,0) == ERR_NOT_IN_RANGE){
                                    creep.moveTo(memory_closestPickup);
                                }
                            }
                            else{
                                creep.memory.closestPickup = '';
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