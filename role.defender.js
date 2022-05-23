var roleDefender = {
    run: function(creep) {
        var attack_targets = creep.room.find(FIND_HOSTILE_CREEPS);
        var attack_target = creep.pos.findClosestByPath(attack_targets);
        var rampartsAvailable = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_RAMPART && s.room.lookForAt(LOOK_CREEPS,s.pos).length === 0);
        var closestRampart = creep.pos.findClosestByPath(rampartsAvailable);
        let closest_rampart_to_defender = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, s => s.structureType === STRUCTURE_RAMPART))

        // If enemies in room -> set memory attacking to true
        if(attack_targets.length > 0){
            creep.memory.attacking = true;
        }
        else{
            creep.memory.attacking = false;
        }
        if(creep.memory.attacking){
            if(creep.attack(attack_target) === ERR_NOT_IN_RANGE){
                creep.moveTo(attack_target);
            }
            if(rampartsAvailable.length > 0 && creep.pos != closestRampart.pos || creep.pos != closest_rampart_to_defender.pos){
                // creep.moveTo(closestRampart);
            }
            else if(rampartsAvailable.length === 0){
                creep.say("All Ramparts Occupied!")
            }
            if(creep.pos === closestRampart.pos){
                creep.attack(attack_target);
            }
        }
        // If memory attacking not true
        else{
            // If creep has targetRampart in memory
            if(creep.memory.targetRampart){
                let targetRampart = Game.getObjectById(creep.memory.targetRampart)
                // If creep on targetRampat -> delete targetRampart memory and set inPlace to be true!
                if(creep.pos.x === targetRampart.pos.x && creep.pos.y === targetRampart.pos.y){
                    console.log('testtest')
                    delete creep.memory.targetRampart;
                    creep.memory.inPlace = true;
                }
                else if(creep.room.lookForAt(LOOK_CREEPS,targetRampart.pos).length > 0){
                    delete creep.memory.targetRampart
                }
                else{
                    creep.moveTo(targetRampart);
                }
            }
            else{
                if(creep.memory.inPlace){
                    if(creep.room.lookForAt(LOOK_STRUCTURES, creep.pos)){
                        creep.say("Yay there's a structure where I stand!")
                    }
                }
                if(!creep.memory.inPlace){
                    if(rampartsAvailable.length>0){
                    creep.memory.targetRampart = creep.pos.findClosestByPath(rampartsAvailable).id;
                    }
                    else{
                        creep.moveTo(20,15);
                        creep.say('No room for me I gues');
                    }
                }
            }
        }
    }
};
module.exports = roleDefender;