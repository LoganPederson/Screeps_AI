// Import Modules
var roleMiner = require('role.miner');
var roleMule = require('role.mule');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSweeper = require('role.sweeper');
var roleRepair = require('role.repair');
var roleDefender = require('role.defender');
var prototypeMinerSpawn = require('prototype.minerBody')();
var prototypeMuleSpawn = require('prototype.muleBody')();
var prototypeCustomSpawn = require('prototype.customCreep')();
var prototypeDefenderSpawn = require('prototype.evenDefender')();

//
//Run Each tick
module.exports.loop = function () {
    
    //Delete old creeps from memory
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    // Run for each Creep
    for(let creepName in Game.creeps) {
        var creep = Game.creeps[creepName];
        creep.memory.creepRoom = creep.room.name;
    }
    //Run for each Room
    for(let roomName in Game.rooms){
        let room = Game.rooms[roomName];
        room.memory.sources = []
        room.memory.availableWorkers = []
        var spawners = _.filter(room.find(FIND_MY_STRUCTURES), (s) => s.structureType == STRUCTURE_SPAWN);
        var spawn = spawners[0].name
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        var attackers = room.find(FIND_HOSTILE_CREEPS);
        var signers = _.filter(Game.creeps, (creep) => creep.memory.role == 'signer');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        var sweepers = _.filter(Game.creeps, (creep) => creep.memory.role == 'sweeper');
        var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        var energyA = Game.spawns[spawn].room.energyAvailable;
        var energyC = Game.spawns[spawn].room.energyCapacityAvailable;


        // Assign stage based on controllerLevel
        let controllerLevel = room.controller.level;
        if(controllerLevel < 5){
            room.memory.stage = 'Charmander'
        }
        if(controllerLevel > 4 && controllerLevel < 7){
            room.memory.stage = 'Charmeleon'
        }
        if(controllerLevel > 7){
            room.memory.stage = 'Charzard'
        }        
        
        
        // Store Source Id's in each rooms if not present
        if(room.memory.sources.length < 1){
            var allSources = room.find(FIND_SOURCES);
            for(let source of allSources){
                let id = source.id;
                room.memory.sources.push(source.id);
            }
        }
        if(room.memory.stage === 'Charmander'){
            console.log('----------------------------Game Stage Charmander----------------------------');
            //SPAWN LOGIC
            var builders_wanted = 1;
            var upgraders_wanted = 2;
            var defenders_wanted = 1;
            var signers_wanted = 0;
            var miners_wanted = 4;
            var mules_wanted = 3;
            var repairs_wanted = 1;
            var sweepers_wanted = 0;
    
           if(!Game.spawns[spawn].spawning && (room.energyAvailable > 299)){
               // MINERS priority 0
               if(miners.length < miners_wanted){
                   if(room.energyAvailable < 850){
                   console.log('Spawning new miner!');
                   Game.spawns[spawn].createMinerCreep(energyA, 'miner');
                   }
                   else{
                       Game.spawns[spawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'miner '+Game.time,{memory:{role: 'miner' }}
                       );
                   }
                }
                else if(attackers.length > 0 && defenders.length < defenders_wanted){
                    console.log('Spawning new Defender! Attackers present!');
                    Game.spawns[spawn].createDefenderCreep(energyA, 'defender');
                }
                else if(mules.length < mules_wanted){
                    console.log('Spawning new Mule!');
                    Game.spawns[spawn].createMuleCreep(energyA, 'mule');
                }
                else if(upgraders.length < upgraders_wanted){
                    console.log('Spawning new Upgrader!');
                    Game.spawns[spawn].createCustomCreep(energyA, 'upgrader');
                }
               else if(builders.length < builders_wanted){
                   console.log('Spawning new Builder!');
                   Game.spawns[spawn].createCustomCreep(energyA, 'builder');
               }
               else if(sweepers.length < 1 && Game.spawns[spawn].room.find(FIND_RUINS).filter(ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0).length != 0){
                   console.log('Spawning new Sweeper!');
                   Game.spawns[spawn].createMuleCreep(energyA, 'sweeper');
               }
               else if(repairs.length < repairs_wanted){
                   console.log('Spawning new Repairer!!');
                   Game.spawns[spawn].createCustomCreep(energyA, 'repair');
               }
               else if(defenders.length < defenders_wanted){
                   console.log('Spawning new Defender!!');
                   Game.spawns[spawn].spawnCreep([MOVE,ATTACK,MOVE,ATTACK,TOUGH,TOUGH], 'defender '+Game.time,{memory:{role: 'defender' }})
               }
           }
        }

        //CHARMELON LOGIC
        if(room.memory.stage === 'Charmeleon'){
            console.log('----------------------------Game Stage Charmeleon----------------------------');
            //SPAWN LOGIC
            var builders_wanted = 1;
            var upgraders_wanted = 2;
            var defenders_wanted = 1;
            var signers_wanted = 0;
            var miners_wanted = 2;
            var mules_wanted = 3;
            var repairs_wanted = 1;
            var sweepers_wanted = 0;
    
           if(!Game.spawns[spawn].spawning && (room.energyAvailable > 299)){
               // MINERS priority 0
               if(miners.length < miners_wanted){
                   if(room.energyAvailable < 850){
                   console.log('Spawning new miner!');
                   Game.spawns[spawn].createMinerCreep(energyA, 'miner');
                   }
                   else{
                       Game.spawns[spawn].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'miner '+Game.time,{memory:{role: 'miner' }}
                       );
                   }
                }
                else if(attackers.length > 0 && defenders.length < defenders_wanted){
                    console.log('Spawning new Defender! Attackers present!');
                    Game.spawns[spawn].createDefenderCreep(energyA, 'defender');
                }
                else if(mules.length < mules_wanted){
                    console.log('Spawning new Mule!');
                    Game.spawns[spawn].createMuleCreep(energyA, 'mule');
                }
                else if(upgraders.length < upgraders_wanted){
                    console.log('Spawning new Upgrader!');
                    Game.spawns[spawn].createCustomCreep(energyA, 'upgrader');
                }
               else if(builders.length < builders_wanted){
                   console.log('Spawning new Builder!');
                   Game.spawns[spawn].createCustomCreep(energyA, 'builder');
               }
               else if(sweepers.length < 1 && Game.spawns[spawn].room.find(FIND_RUINS).filter(ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0).length != 0){
                   console.log('Spawning new Sweeper!');
                   Game.spawns[spawn].createMuleCreep(energyA, 'sweeper');
               }
               else if(repairs.length < repairs_wanted){
                   console.log('Spawning new Repairer!!');
                   Game.spawns[spawn].createCustomCreep(energyA, 'repair');
               }
               else if(defenders.length < defenders_wanted){
                   console.log('Spawning new Defender!!');
                   Game.spawns[spawn].spawnCreep([MOVE,ATTACK,MOVE,ATTACK,TOUGH,TOUGH], 'defender '+Game.time,{memory:{role: 'defender' }})
               }
           }
        }
    }
       
       // Run for each creep
    for(var name in Game.creeps) {
        //creep.suicide();
        var creep = Game.creeps[name];
        if(!creep.memory.creepRoom){
            creep.memory.creepRoom = creep.room.name
        }
        if(creep.memory.role == 'miner'){
            roleMiner.run(creep);
        }
        if(creep.memory.role == 'mule'){
            roleMule.run(creep);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'signer') {
            roleSigner.run(creep);
        }
        if(creep.memory.role == 'attacker'){
            roleAttacker.run(creep);
        }
        if(creep.memory.role == 'sweeper'){
            roleSweeper.run(creep);
        }
        if(creep.memory.role == 'repair'){
            roleRepair.run(creep);
        }
    }
        
    //Tower logic!
    for(var index in towers){
        var tower = towers[index];
        
        
        // If hostile creeps -> 
        if(tower.room.find(FIND_HOSTILE_CREEPS).length > 0){
            //Set target to closest for now and attack
            let target = tower.pos.findClosestByPath(tower.room.find(FIND_HOSTILE_CREEPS));
            tower.attack(target);
        }
        // If no hostile creeps ->
        else{
            //If creeps injured, heal them!
            let injuredCreeps = _.filter(tower.room.find(FIND_MY_CREEPS), (creep) => creep.hits < creep.hitsMax);
            
            if(injuredCreeps.length > 1){
                let closestInjured = tower.pos.findClosestByPath(injuredCreeps);
                tower.heal(closestInjured);
            }
            // If no injured friendly creeps, && no enemy creeps -> repair
            else{
                repair_Target = _.filter(tower.room.find(FIND_MY_STRUCTURES), (s) => s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_RAMPART);
                tower.repair(tower.pos.findClosestByPath(repair_Target));
            }
            
        }
    }

};




//