var roleMule = {
    run: function(creep) {
        /* Creep hauls energy from miners to storage
        
            Different states to conisder:
                Full inv and collecting
                Emtpy inv and Collecting
                Storage containers/
                Body parts
        
        **/ 
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        
        var requestingCreeps = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return(creep.memory.requestingPickup == true);
            }
        });
        
        // If not collecting and inventory is empty - set collecting to be true
        if(!creep.memory.collecting && creep.store.getUsedCapacity([RESOURCE_ENERGY]) == 0){
            creep.memory.collecting = true;
        }
        // If collecting and inventory full - collecting to false
        if(creep.memory.collecting && creep.store.getFreeCapacity([RESOURCE_ENERGY])==0){
            creep.memory.collecting = false;
        }
        
        
        
        // If collecting set
        if(creep.memory.collecting) {
            // requestingCreeps = array of creeps with requestingPickup = true
            
            var closestPickup = creep.pos.findClosestByPath(requestingCreeps);
            var muleDuplicateTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestPickup)) == closestPickup);
            var memory_closestPickup = Game.getObjectById(creep.memory.closestPickup);
            if(!creep.memory.closestPickup && requestingCreeps.length != 0){
                if(muleDuplicateTargets.length > 1){
                    nextTarget = requestingCreeps;
                    nextTarget.splice(closestPickup, nextTarget[1]);
                    nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                    creep.memory.closestPickup = nextClosestTarget.id;
                }
                else{
                    creep.memory.closestPickup = closestPickup.id;
                }
            }
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
                            if(creep.transfer(memory_closestPickup, RESOURCE_ENERGY, [0]) == ERR_NOT_IN_RANGE){
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
                console.log('No energy, and no creeps requesting');
                creep.moveTo(34,25);
                
            }
        }
    }
}


module.exports = roleMule;