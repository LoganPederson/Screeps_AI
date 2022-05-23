const roleMiner = require('role.miner');
const roleMule = require('role.mule');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleExpansionBuilder = require('role.expansionBuilder');
const roleSweeper = require('role.sweeper');
const roleRepair = require('role.repair');
const roleDefender = require('role.defender');
const roleClaimer = require('role.claimer');
const prototypeMinerSpawn = require('prototype.minerBody')();
const prototypeMuleSpawn = require('prototype.muleBody')();
const prototypeCustomSpawn = require('prototype.customCreep')();
const prototypeDefenderSpawn = require('prototype.evenDefender')();

module.exports = {
    roleMiner: 'roleMiner',
    roleMule: 'roleMule',
    roleUpgrader : 'roleUpgrader',
    roleBuilder : 'roleBuilder',
    roleExpansionBuilder : 'roleExpansionBuilder',
    roleSweeper : 'roleSweeper',
    roleRepair : 'roleRepair',
    roleDefender : 'roleDefender',
    roleClaimer : 'roleClaimer',   
    prototypeMinerSpawn : 'prototypeMinerSpawn',
    prototypeMuleSpawn : 'prototypeMuleSpawn',
    prototypeCustomSpawn : 'prototypeCustomSpawn',
    prototypeDefenderSpawn : 'prototypeDefenderSpawn'
}