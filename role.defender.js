var roleDefender = {
    run: function(creep) {
        var attack_targets = creep.room.find(FIND_HOSTILE_CREEPS);
        var attack_target = creep.pos.findClosestByPath(attack_targets);
        var rampartsAvailable = _.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_RAMPART && s.room.lookForAt(LOOK_CREEPS,s).length === 0);
        var closestRampart = creep.pos.findClosestByPath(rampartsAvailable);

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
            if(rampartsAvailable.length > 0 && creep.pos != closestRampart.pos){
                creep.moveTo(closestRampart);
            }
            else if(rampartsAvailable.length === 0){
                creep.say("All Ramparts Occupied!")
            }
            if(creep.pos === closestRampart.pos){
                creep.attack(attack_target);
            }
        }
        else{
            let closestRampart = creep.pos.findClosestByPath(_.filter(creep.room.find(FIND_STRUCTURES), (s) => s.structureType === STRUCTURE_RAMPART));
            if(creep.pos != closestRampart.pos){
                creep.moveTo(closestRampart);
            }
        }
    }
};
module.exports = roleDefender;