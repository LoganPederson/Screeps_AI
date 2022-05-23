var roleExtractor = {
    run: function(creep){
        //VARIABLES
        let containers = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_CONTAINER);
        let closestContainer = creep.pos.findClosestByPath(containers);
        let closestExtractor = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES,(s) => s.structureType === STRUCTURE_EXTRACTOR));
        let closestMineral = creep.pos.findClosestByPath(creep.room.find(FIND_MINERALS));

        let mineralType = closestMineral.mineralType;
        if(creep.store.getUsedCapacity([mineralType]) === 0){
            creep.memory.extracting = true;
        }
        if(creep.store.getFreeCapacity([mineralType]) === 0){
            creep.memory.extracting = false;
        }


        if(creep.memory.extracting){
            if(creep.harvest(closestExtractor) === ERR_NOT_IN_RANGE){
                creep.moveTo(closestExtractor);
            }
        }
        else{
            if(creep.transfer(closestContainer, mineralType) === ERR_NOT_IN_RANGE){
                creep.moveTo(closestContainer);
            }
        }
    }
}
module.exports = roleExtractor;