module.exports = function(){
    StructureSpawn.prototype.createDefenderCreep = function(energy, roleName) {
        var attackParts = Math.floor((energy / 2) / 100);
        let energyAfter = (energy-attackParts*100);
        var carryParts = Math.floor((energyAfter / 2) / 50);
        var moveParts = Math.floor((energyAfter / 2) / 50);
        var body = [];
        for (let i = 0; i < 2; i++){
            body.push(TOUGH);
        }
        for (let i =0; i < moveParts; i++){
            body.push(MOVE);
        }
        for (let i = 0; i < attackParts; i++) {
            body.push(ATTACK);
        }
        return this.spawnCreep(body,roleName+Game.time, {memory:{role: roleName }});
    }
}

//ATTACK COST 80
//MOVE COST 50
//TOUGH COST 10