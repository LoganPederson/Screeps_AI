// Import Modules
var roleMiner = require('role.miner');
var roleMule = require('role.mule');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSweeper = require('role.sweeper');
var roleRepair = require('role.repair');
var prototypeMinerSpawn = require('prototype.minerBody')();
var prototypeMuleSpawn = require('prototype.muleBody')();
var prototypeCustomSpawn = require('prototype.customCreep')();
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
        creep.memory.creepRoom = 'W32N56';
    }
    //Run for each Room
    for(let roomName in Game.rooms){
        let room = Game.rooms[roomName];
        room.memory.sources = []
        room.memory.availableWorkers = []
        
        // Assign stage based on controllerLevel
        let controllerLevel = room.controller.level;
        if(controllerLevel < 5){
            room.memory.stage = 'Charmander'
        }
        if(controllerLevel > 5 && controllerLevel < 7){
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
    }
    
    
    // Fresh Start Bootstraping AI
    if(Game.rooms['W32N56'].memory.stage == 'Charmander'){
        console.log('----------------------------Game Stage Charmander----------------------------');
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        var attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker');
        var signers = _.filter(Game.creeps, (creep) => creep.memory.role == 'signer');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var mules = _.filter(Game.creeps, (creep) => creep.memory.role == 'mule');
        var repairs = _.filter(Game.creeps, (creep) => creep.memory.role == 'repair');
        var sweepers = _.filter(Game.creeps, (creep) => creep.memory.role == 'sweeper');
        var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
        var energyA = Game.spawns['Spawn1'].room.energyAvailable;
        var energyC = Game.spawns['Spawn1'].room.energyCapacityAvailable;

       
       //SPAWN LOGIC
       var builders_wanted = 1;
       var upgraders_wanted = 2;
       var defenders_wanted = 0;
       var signers_wanted = 0;
       var miners_wanted = 2;
       var mules_wanted = 3;
       var repairs_wanted = 1;
       var sweepers_wanted = 0;

       if(!Game.spawns['Spawn1'].spawning && (Game.rooms['W32N56'].energyAvailable > 299)){
           // MINERS priority 0
           if(miners.length < miners_wanted){
               if(Game.rooms['W32N56'].energyAvailable < 850){
               console.log('Spawning new miner!');
               Game.spawns['Spawn1'].createMinerCreep(energyA, 'miner');
               }
               else{
                   Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'miner '+Game.time,{memory:{role: 'miner' }}
                   );
               }
            }
            else if(mules.length < mules_wanted){
                console.log('Spawning new Mule!');
                Game.spawns['Spawn1'].createMuleCreep(energyA, 'mule');
            }
            else if(upgraders.length < upgraders_wanted){
                console.log('Spawning new Upgrader!');
                Game.spawns['Spawn1'].createCustomCreep(energyA, 'upgrader');
            }
           else if(builders.length < builders_wanted){
               console.log('Spawning new Builder!');
               Game.spawns['Spawn1'].createCustomCreep(energyA, 'builder');
           }
           else if(sweepers.length < 1 && Game.spawns['Spawn1'].room.find(FIND_RUINS).filter(ruin => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0).length != 0){
               console.log('Spawning new Sweeper!');
               Game.spawns['Spawn1'].createMuleCreep(energyA, 'sweeper');
           }
           else if(repairs.length < repairs_wanted){
               console.log('Spawning new Repairer!!');
               Game.spawns['Spawn1'].createCustomCreep(energyA, 'repair');
           }
       }
       
       // Run for each creep
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(!creep.memory.creepRoom){
                creep.memory.creepRoom = '[room W32N56]'
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
            if(tower.room.find(FIND_HOSTILE_CREEPS).length > 1){
                //Set target to closest for now and attack
                
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
    }
};




//