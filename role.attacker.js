var roleAttacker = {
    run: function(creep){

        let redFlags = _.filter(Game.flags, (f) => f.color === COLOR_RED);
        let redFlag0 = redFlags[0]
        let enemyCreepsInRoom = creep.room.find(FIND_HOSTILE_CREEPS);
        let enemySpawnsInRoom = creep.room.find(FIND_HOSTILE_SPAWNS);
        let enemyPowerCreepsInRoom = creep.room.find(FIND_HOSTILE_POWER_CREEPS);
        let enemyConstructionSitesInRoom = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
        let enemyStructuresInRoom = creep.room.find(FIND_HOSTILE_STRUCTURES);
        let closestEnemyCreep = creep.pos.findClosestByPath(enemyCreepsInRoom);
        let closestEnemySpawn = creep.pos.findClosestByPath(enemySpawnsInRoom);



        if(!redFlag0){
            creep.suicide();
        }
        //Assign roomName to memory
        if(creep.memory.roomName){
            if(creep.room != creep.memory.roomName){
                delete creep.memory.roomName
            }
        }
        else{
            creep.memory.roomName = creep.room
        }

        if(creep.room != redFlag0.room || creep.pos.x === 0 || creep.pos.y === 0){
            creep.moveTo(redFlag0);
        }
        else{
            //If enemy creeps -> kill kill kill
            if(enemyCreepsInRoom.length > 0){
                if(creep.attack(closestEnemyCreep) === ERR_NOT_IN_RANGE){
                    creep.moveTo(closestEnemyCreep);
                }
            }
            else if(enemySpawnsInRoom.length > 0){
                if(creep.attack(closestEnemySpawn) === ERR_NOT_IN_RANGE){
                    creep.moveTo(closestEnemySpawn);
                }
            }
            else if(enemyStructuresInRoom.length > 0){
                if(creep.attack(creep.pos.findClosestByPath(enemyStructuresInRoom)) === ERR_NOT_IN_RANGE){
                    creep.moveTo(creep.pos.findClosestByPath(enemyStructuresInRoom));
                }
            }
            // else if(enemyConstructionSitesInRoom.length > 0){
            //     console.log('test')
            //     if(creep.attack(creep.pos.findClosestByPath(enemyConstructionSitesInRoom)) === ERR_NOT_IN_RANGE){
            //         creep.moveTo(creep.pos.findClosestByPath(enemyConstructionSitesInRoom));
            //     }
            // }
            else if(enemyStructuresInRoom.length === 0 && enemySpawnsInRoom.length === 0 && enemyCreepsInRoom.length === 0 && enemyPowerCreepsInRoom.length === 0){
                let redFlagInRoom = _.filter(creep.room.find(FIND_FLAGS), (f) => f.color === COLOR_RED)
                redFlag0.remove();
                creep.suicide();
                console.log('Attacker Creep: '+creep.name+' has ended his life honorably after completing the mission. Bravo to the creep')
            }
        }
    }
}
module.exports = roleAttacker;