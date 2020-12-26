module.exports = function(){
    StructureSpawn.prototype.createMuleCreep = function(energy, roleName) {
        var workParts = Math.floor((energy / 2) / 100);
        let energyAfter = (energy-workParts*100);
        var carryParts = Math.floor((energy / 2) / 50);
        var moveParts = Math.floor((energy / 2) / 50);
        var body = [];
        for (let i = 0; i < carryParts; i++){
            body.push(CARRY);
        }
        for (let i =0; i < moveParts; i++){
            body.push(MOVE);
        }
        for (let i = 0; i < 0; i++) {
            body.push(WORK);
        }
        return this.spawnCreep(body,roleName+Game.time, {memory:{role: roleName }});
    }
}