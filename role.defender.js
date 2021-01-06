var roleDefender = {
    run: function(creep) {
        var attack_targets = creep.room.find(FIND_HOSTILE_CREEPS);
        var attack_target = creep.pos.findClosestByPath(attack_targets);
        
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
        }
        else{
            creep.moveTo(38,29);
        }
    }
};
module.exports = roleDefender;