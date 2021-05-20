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
                return ((structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER)  && structure.store.getFreeCapacity([RESOURCE_ENERGY]) != 0)
            }
        });
        //CONTAINERS IN ROOM MEMORY AS HAVING DROPPED BELOW 40% ENERGY, THEY WILL REMAIN REQUESTING UNTIL THEY GO ABOVE 90% ENERGY
        let containersRequestingEnergy = []
        for(let thisContainer in creep.room.memory.containersRequestingEnergy){
            let container = creep.room.memory.containersRequestingEnergy[thisContainer];
            containersRequestingEnergy.push(Game.getObjectById(container));
        }
        //CONTAINERS > 90% CAPACITY && NOT REQUESTING
        var containersOverflowingEnergy = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER && ((structure.store.getUsedCapacity([RESOURCE_ENERGY]) > (structure.store.getCapacity([RESOURCE_ENERGY])*0.9)) && (!containersRequestingEnergy.includes(structure.id))))
            }
        });
        console.log(containersOverflowingEnergy + "Are overflowing energy!");// && (structure.store.getUsedCapacity([RESOURCE_ENERGY]) > (structure.store.getCapacity([RESOURCE_ENERGY])*0.4))))));
        //&& (!containersRequestingEnergy.includes(structure.id))
        let targetGrabContainer = creep.pos.findClosestByPath(containersOverflowingEnergy);
        let targetFillContainer = creep.pos.findClosestByPath(containersRequestingEnergy);

        var notFullStructures = _.filter(creep.room.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_TOWER && s.store.getFreeCapacity != 0);
        var containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) > 0);
        var containersAll = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
        // IF CONTAINERS IN ROOM -> 
        if(containersAll.length > 0){
            // var closestContainer = creep.pos.findClosestByPath(containers);
            //IF NOT COLLECTING AND INVENTORY EMPTY AND CREEPS NEED ENERGY OR BUILDINGS DO -> COLLECT
            if(!creep.memory.collecting && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0 && (containersRequestingEnergy.length > 0 || fillingTargets.length > 0)){
                creep.memory.collecting = true;
            }
            //IF COLLECTING AND INVENTORY FULL -> STOP COLLECTING
            if(creep.memory.collecting && creep.store.getFreeCapacity([RESOURCE_ENERGY])===0){
                creep.memory.collecting = false;
            }
            else if(creep.memory.collecting && containersRequestingEnergy.length === 0 && fillingTargets.length === 0){
                creep.memory.collecting = false;
            }
            
            
            
            //IF COLLECTING
            if(creep.memory.collecting) {
                console.log("Array of requesting containers: "+containersRequestingEnergy)
                console.log('Closest container to creep that has 500 or more energy, and is not in the array of requesting creeps '+creep.pos.findClosestByPath(_.filter(containers,(c) => (c.store.getUsedCapacity([RESOURCE_ENERGY]) > 500) && !containersRequestingEnergy.includes(c.id))));
                //IF LESS REQUESTING ENERGY THAN WE HAVE (MEANING SOME CONTAINERS ABOVE 90%)
                if(containersOverflowingEnergy.length > 0){
                    //GRAB FROM OVERFLOWING CONTAINER
                    var withdrawAmountMax = 1000
                    if(creep.store.getCapacity([RESOURCE_ENERGY])-creep.store.getUsedCapacity([RESOURCE_ENERGY]) < withdrawAmountMax){
                        var withdrawAmount = creep.store.getCapacity([RESOURCE_ENERGY])-creep.store.getUsedCapacity([RESOURCE_ENERGY]);     
                    }
                    else if(creep.store.getCapacity([RESOURCE_ENERGY])-creep.store.getUsedCapacity([RESOURCE_ENERGY]) >= withdrawAmountMax){
                        var withdrawAmount = withdrawAmountMax
                    }
                    if(creep.withdraw(targetGrabContainer, RESOURCE_ENERGY, withdrawAmount) === ERR_NOT_IN_RANGE){
                        creep.moveTo(targetGrabContainer);
                        console.log('Mule 73 withdrawing from closest targetGrabContainer'+targetGrabContainer)
                    }
                }
                //IF ALL CONTAINERS LOWER THAN 90% -> SET CLOSEST CONTAINER TO CLOSEST WITH > 25% ENERGY
                else {
                    let closestContainer = creep.pos.findClosestByPath(_.filter(containers,(c) => (c.store.getUsedCapacity([RESOURCE_ENERGY]) > 500) && !containersRequestingEnergy.includes(c.id)));
                    console.log("closestContainer line 79 "+closestContainer);
                    if(closestContainer){
                        var withdrawAmountMax = closestContainer.store.getUsedCapacity([RESOURCE_ENERGY])-500
                    }
                    if(creep.withdraw(closestContainer, RESOURCE_ENERGY, withdrawAmountMax) === ERR_NOT_IN_RANGE){
                        creep.moveTo(closestContainer);
                        console.log("No overflowing containers, going to closestContainer which should* be >500 84");
                    }
                }
            }
            //IF NOT COLLECTING
            else{
                var closestRequestingEnergy = creep.pos.findClosestByPath(containersRequestingEnergy);
                var memory_closestRequestingEnergy = Game.getObjectById(creep.memory.closestRequestingEnergy);
                var muleDuplicatefillingTargets = _.filter(creep.room.find(FIND_MY_CREEPS), (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestRequestingEnergy)) === closestRequestingEnergy);
                
                            // //IF CLOSESTREQUESTINGENERGY NOT SET -> SET IT redacted 05/19/2021 1833 due to containers in room, no creeps will request a mule bring them energy. Instead they will use containers
                // if((!creep.memory.closestRequestingEnergy || creep.memory.closestRequestingEnergy === undefined) && creepsRequestingEnergy.length != 0){
                //     creep.memory.closestRequestingEnergy = closestRequestingEnergy.id
                // }
                //IF OTHER MULE HAS SAME TARGET SET && MORE REQUESTING ENERGY THAN MULES -> CHOOSE FURTHER TARGET TO MEMORY
                if(muleDuplicatefillingTargets.length > 1 && containersRequestingEnergy.length > mules.length){
                    let nextTarget = containersRequestingEnergy;
                    nextTarget.splice(containersRequestingEnergy, nextTarget[1]);
                    //IF NEW TARGET NOT NULL -> SET 
                    if(creep.pos.findClosestByPath(nextTarget) != null){
                        nextClosestTarget = creep.pos.findClosestByPath(nextTarget);
                        creep.memory.closestRequestingEnergy = nextClosestTarget.id;
                    }
                    else{
                        creep.say("Can't Reach or No Creeps!");
                    }
                }
                //IF NO DUPLICATE MULE fillingTargets, OR LESS REQUESTING ENERGY THAN MULES

                // else if(closestRequestingEnergy){
                //     //CLOSEST REQUESTING ENERGY BECOMES TARGET
                //     creep.memory.closestRequestingEnergy = closestRequestingEnergy.id;
                // }

                //IF BUILDINGS NEED ENERGY AND CREEP HAS SOME -> MOVE TO AND FILL
                if(fillingTargets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0) {
                    if(creep.transfer(creep.pos.findClosestByPath(fillingTargets), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.pos.findClosestByPath(fillingTargets), {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //IF NO BUILDINGS NEED ENERGY && CONTAINERS REQUESTING
                else if(fillingTargets.length === 0 && containersRequestingEnergy.length > 0){
                        
                    let targetFillContainer = creep.pos.findClosestByPath(containersRequestingEnergy);
                        
                        //IF MULE FULL OF ENERGY -> TRANSFER TO CONTAINER THAT NEEDS ENERGY
                    if(creep.transfer(targetFillContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        
                        creep.moveTo(targetFillContainer);
                        console.log("Filling the targetFillContainer 127 and target is: "+targetFillContainer);
                    }
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
                var muleDuplicatefillingTargets = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule' && (Game.getObjectById(creep.memory.closestRequesting)) === closestRequesting);
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
                            //console.log(creep.name+" I see no duplicate fill targets, so I set closest requesting creep to memory")
                        }
                    }
                }
                //IF CREEP HAS closestRequesting IN MEMORY
                else if(containers.length > 0){
                    //IF MORE REQUESTING THAN MULES
                    if(requestingCreeps.length > mules.length || requestingCreeps.length === mules.length){
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
                                    //console.log("Closest requesting to me: "+creep.name+ " is "+memory_closestRequesting)
                                }
                            }
                            else{
                                creep.memory.closestRequesting = closestRequesting.id;
                                //console.log("Not closest to creep but more mules than requesting")
                                creep.memory.collecting=false;
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
               //IF BUILDINGS NEED ENERGY AND CREEP HAS SOME -> MOVE TO AND FILL
                if(fillingTargets.length > 0 && creep.store.getUsedCapacity([RESOURCE_ENERGY]) > 0) {
                    if(creep.transfer(fillingTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(fillingTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //IF NO BUILDINGS NEED ENERGY NOR CREEPS
                else if(requestingCreeps.length === 0 && creepsRequestingEnergy.length === 0){
                    creep.moveTo(21,33);
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
                    if(closestRequestingEnergy && fillingTargets.length === 0){
                        //CLOSEST REQUESTING ENERGY BECOMES TARGET
                        creep.memory.closestRequestingEnergy = closestRequestingEnergy.id;
                        if(creep.transfer(Game.getObjectById(creep.memory.closestRequestingEnergy), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(Game.getObjectById(creep.memory.closestRequestingEnergy), {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
        }
    }
}


module.exports = roleMule;