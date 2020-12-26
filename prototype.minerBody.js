module.exports = function(){
    StructureSpawn.prototype.createMinerCreep = function(energy, roleName, sourceID) {
        var workParts = Math.floor(((energy-50) / 2) / 100);
        var energyAfter = (energy-50);
        var carryParts = 1;
        var moveParts = Math.floor((energyAfter / 4) / 50);
        var body = [];
        var listSources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        for (let i = 0; i < carryParts; i++){
            body.push(CARRY);
        }
        
        
        for (let i =0; i < moveParts; i++){
            body.push(MOVE);
        }
        
        for (let i = 0; i < workParts; i++) {
            body.push(WORK);
        }
        if(miners < 2){
            var x = listSources[0];
        }
        else{
            var x = listSources[1];
        }
        return this.spawnCreep(body,roleName+Game.time, {memory:{
            role: roleName, 
            sourceID: listSources[x] 
        }});
    }
}