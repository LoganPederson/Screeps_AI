var roleMule2 = {
    run: function(creep) {
        


        //VARIABLES
        let room = creep.room
        let mules2 = _.filter(creep.room.find(FIND_MY_CREEPS),(c) => c.memory.role === 'mule2');
        let containersAll = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
        let containersWithEnergy =_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) > 0);
        let containersRequestingEnergy = creep.room.memory.containersRequestingEnergy.map( c => Game.getObjectById(c));
        let containersOverflowingEnergy = _.filter(creep.room.find(FIND_STRUCTURES),s => s.structureType === STRUCTURE_CONTAINER && s.store.getUsedCapacity([RESOURCE_ENERGY]) > 1800);
        let creepsRequesting = _.filter(creep.room.find(FIND_MY_CREEPS), (c) => c.memory.requestingPickup === true);
        let creepsRequestingEnergy = _.filter(creep.room.find(FIND_MY_CREEPS), (c) => c.memory.requestingEnergy === true);
        let unassignedCreepsRequestingEnergy = creepsRequestingEnergy
        let mulesCollecting = _.filter(creep.room.find(FIND_MY_CREEPS), (c) => c.memory.role === 'mule2' && c.memory.collecting === true);
        let fillingTargets = _.filter(creep.room.find(FIND_STRUCTURES),(s) => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER)  && s.store.getFreeCapacity([RESOURCE_ENERGY]) != 0)
        let storagesAll = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_STORAGE);
        let storagesWithEnergy = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_STORAGE && s.store.getUsedCapacity([RESOURCE_ENERGY]) > (s.store.getCapacity([RESOURCE_ENERGY])*0.4));
        let storagesFull = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity([RESOURCE_ENERGY]) === 0);
        let storagesNotFull = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_STORAGE && s.store.getFreeCapacity([RESOURCE_ENERGY]) > 0);

        let collectingTargetsAlreadySet = [];
        for (let m in mulesCollecting) {
            collectingTargetsAlreadySet.push(mulesCollecting[m].memory.collectingTarget); // create array of ID of targets already set by existing mules
        }
        // filter collecting targets by collectingTargetsAlreadySet array
        let creepsRequestingNotTargeted = _.filter(creepsRequesting, (c) => !collectingTargetsAlreadySet.includes(c.id));
        console.log('creepsRequesting = '+ creepsRequesting);
        console.log('creepsRequestingNotTargeted = ' + creepsRequestingNotTargeted);



        //IF NOT COLLECTING AND NO ENERGY -> COLLECT
        if(!creep.memory.collecting && creep.store.getUsedCapacity([RESOURCE_ENERGY]) === 0){
            creep.memory.collecting = true;
        }
        //IF COLLECTING AND INVENTORY FULL -> STOP COLLECTING
        if(creep.memory.collecting && creep.store.getFreeCapacity([RESOURCE_ENERGY])===0){
            creep.memory.collecting = false;
            delete creep.memory.collectingTarget
        }
        //IF COLLECTING
        if(creep.memory.collecting){
            //IF COLLECTING TARGET IS EMPTY -> DELETE COLLECTING TARGET FROM MEMORY
            if(creep.memory.collectingTarget != undefined){
                if((Game.getObjectById(creep.memory.collectingTarget)) != null){
                    if(Game.getObjectById(creep.memory.collectingTarget).store.getUsedCapacity([RESOURCE_ENERGY]) === 0){
                        delete creep.memory.collectingTarget;
                    }
                    else{
                        if (creep.moveTo(Game.getObjectById(creep.memory.collectingTarget)) === ERR_NO_PATH){
                            console.log(creep.name+' no path to collectingTarget in memory!');
                        }
                        
                    } //refactor layout
                }
                if(creep.memory.fillingTarget){
                    if(creep.memory.collectingTarget === creep.memory.fillingTarget){
                        delete creep.memory.fillingTarget;
                        console.log('testing?')
                    }
                }
                if(containersAll.length > 0 || storagesAll.length > 0){
                    if(creep.withdraw(Game.getObjectById(creep.memory.collectingTarget), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.getObjectById(creep.memory.collectingTarget));
                        
                    }
                    else{
                        creep.withdraw(Game.getObjectById(creep.memory.collectingTarget), RESOURCE_ENERGY);
                        
                    }
                }
                // else if(creep.memory.collectingTarget != undefined){
                //     if(creep.moveTo(Game.getObjectById(creep.memory.collectingTarget)) === ERR_NO_PATH){
                //         creep.moveTo(Game.getObjectById(creep.memory.collectingTarget));
                //     }
                }
            if(!creep.memory.collectingTarget){
                console.log('creep collecting, but has no collectingTarget')
                //IF STORAGES IN ROOM && 40% OR MORE -> SET TO MEMORY
                let closestStorage = creep.pos.findClosestByPath(storagesWithEnergy);
                if(storagesWithEnergy.length > 0 && (closestStorage.store.getUsedCapacity([RESOURCE_ENERGY]) > (closestStorage.store.getCapacity([RESOURCE_ENERGY]) * 0.9))){
                    let closestStorage = creep.pos.findClosestByPath(storagesWithEnergy);
                    creep.memory.collectingTarget = closestStorage.id;
                }

                else if(containersWithEnergy.length >0){ // Should this be >= or just =?
                    console.log(creep.room.name+" "+creep.name+' '+containersWithEnergy.length)
                    if(containersOverflowingEnergy.length > 0){
                        let closestContainerOverflowingEnergy = creep.pos.findClosestByPath(containersOverflowingEnergy);
                        console.log('Closest Container Overflowing Energy: '+closestContainerOverflowingEnergy);
                        creep.memory.collectingTarget = closestContainerOverflowingEnergy.id;
                    }
                    else{
                        let closestContainerWithEnergy = creep.pos.findClosestByPath(containersWithEnergy);
                        if(closestContainerWithEnergy){
                            if(fillingTargets.length > 0){
                                creep.memory.collectingTarget = closestContainerWithEnergy.id;
                            }
                            else{
                                console.log('Mulev2 line 66 No filling targets and no container with 1800+, idling')
                            }
                        }
                        else{
                            console.log('No closestContainerWithEnergy')
                        }
                    }
                }
                //IF CREEPS REQUESTING PICKUP
                else if(creepsRequesting.length > 0){
                    let closestRequesting = creep.pos.findClosestByPath(creepsRequesting);
                    let mulesWithCollectingTargetsSet = mules2.filter(x => x.memory.collectingTarget);
                    creep.memory.collectingTarget = closestRequesting.id;
                    if(mulesWithCollectingTargetsSet.length>0){
                        let collectingTargetsSet = mulesWithCollectingTargetsSet.forEach(m => m.memory.collectingTarget);
                        let creepsRequestingNotTargeted = creepsRequesting.splice(collectingTargetsSet);
                        // IF MORE CREEPS REQUESTING PICKUP THAN MULES -> ONLY 1 MULE PER TARGET
                        if(creepsRequesting.length >= mules2.length){
                            if(memorycollectingTargetOccurances <= 1){
                                creep.memory.collectingTarget = closestRequesting.id
                            }
                            else{
                                console.log(creep.pos.findClosestByPath(creepsRequestingNotTargeted).id)
                                creep.memory.collectingTarget = (creep.pos.findClosestByPath(creepsRequestingNotTargeted).id);
                            }
                        }
                        else{
                            creep.memory.collectingTarget = closestRequesting.id;
                        }
                    }
                    else{
                        creep.memory.collectingTarget = closestRequesting.id;
                    }
                }
            }
        }
        //NOT COLLECTING
        else{
            // IF MEMORY TARGET HAS ROOM FOR ENERGY -> DELIVER! IF NOT, DELETE FROM MEMORY SO ANOTHER GETS SET
            if(Game.getObjectById(creep.memory.fillingTarget) != null){
                if(Game.getObjectById(creep.memory.fillingTarget).store.getFreeCapacity([RESOURCE_ENERGY]) === 0 || (Game.getObjectById(creep.memory.fillingTarget).store.getFreeCapacity([RESOURCE_ENERGY]) >= (Game.getObjectById(creep.memory.fillingTarget).store.getFreeCapacity([RESOURCE_ENERGY]) * 0.9) && Game.getObjectById(creep.memory.fillingTarget).structureType === STRUCTURE_STORAGE) ){
                    delete creep.memory.fillingTarget;
                }
                else{
                    if(creep.transfer(Game.getObjectById(creep.memory.fillingTarget), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.getObjectById(creep.memory.fillingTarget));
                    }
                }
            }
            // IF NO MEMORY FILL TARGET SET -> SET ONE AS NEEDED
            else{
                //IF EXTENSNION/SPAWNS/TOWERS NEED ENERGY -> DELIVER
                if(fillingTargets.length > 0){
                    let closestFillingTarget = creep.pos.findClosestByPath(fillingTargets);
                    //IF MORE MULES THAN FILLING TARGETS, JUST GO TO CLOSEST
                    if(fillingTargets.length < mules2.length){
                        creep.memory.fillingTarget = closestFillingTarget.id
                    }
                    // IF MORE TARGETS THAN MULES, SET MEMORY TO TARGET NOT SET BY ANOTHER MULE
                    else if(fillingTargets.length >= mules2.length){
                        let mulesWithFillingTargetSet = mules2.filter(x => x.memory.fillingTarget);
                        if(mulesWithFillingTargetSet){
                            let fillingTargetsSet = mulesWithFillingTargetSet.map(m => m.memory.fillingTarget)
                            let fillingTargetsNotTargeted = fillingTargets.splice(fillingTargetsSet);
                            creep.memory.fillingTarget = creep.pos.findClosestByPath(fillingTargetsNotTargeted).id;
                        }
                        else{
                            creep.memory.fillingTarget = creep.pos.findClosestByPath(fillingTargets);
                        }
                    }
                }
                //IF CONTAINERS NEED BALANCING -> SET CLOSEST REQUESTING TO MEMORY
                else if(containersRequestingEnergy.length > 0){
                    let closestContainerRequestingEnergy = creep.pos.findClosestByPath(containersRequestingEnergy);
                    creep.memory.fillingTarget = closestContainerRequestingEnergy.id;
                }
                // IF STORAGES AND SOME NOT FULL
                else if(storagesAll.length > 0 && (storagesAll.length > storagesFull.length)){
                    let closestStorage = creep.pos.findClosestByPath(storagesNotFull)
                    //SET MEMORY TO CLOSEST STORAGE
                    creep.memory.fillingTarget = closestStorage.id;
                }
                //IF CREEPS NEED ENERGY BECAUSE THERE ARE NO CONTAINERS FOR THEM TO WITHDRAW FROM
                else if(creepsRequestingEnergy.length > 0){
                    let closestCreepRequestingEnergy = creep.pos.findClosestByPath(creepsRequestingEnergy);
                    creep.memory.fillingTarget = closestCreepRequestingEnergy.id;
                }
                if(creep.memory.fillingTarget){
                    if(creep.transfer(Game.getObjectById(creep.memory.fillingTarget), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                        creep.moveTo(Game.getObjectById(creep.memory.fillingTarget));
                    }
                }
                else{
                    console.log('Mule2 Line 144, no fillingTarget set to memory implies no filling targets need, no storages, no balancing needed, nobody requesting energy')
                    creep.say("Nothing to do")
                }
            }
        }
        // let closestFillingTarget = creep.pos.findClosestByPath(fillingTargets);
        // let closestCreepRequestingPickup = 

        


    }
};


module.exports = roleMule2;