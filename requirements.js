const roleMiner1 = require('role.miner');
const roleMule1 = require('role.mule');
const roleUpgrader1 = require('role.upgrader');
const roleBuilder1 = require('role.builder');
const roleExpansionBuilder1 = require('role.expansionBuilder');
const roleSweeper1 = require('role.sweeper');
const roleRepair1 = require('role.repair');
const roleDefender1 = require('role.defender');
const roleClaimer1 = require('role.claimer');
const prototypeMinerSpawn1 = require('prototype.minerBody')();
const prototypeMuleSpawn1 = require('prototype.muleBody')();
const prototypeCustomSpawn1 = require('prototype.customCreep')();
const prototypeDefenderSpawn1 = require('prototype.evenDefender')();

module.exports = {
    roleMiner: roleMiner1,
    roleMule: roleMule1,
    roleUpgrader : roleUpgrader1,
    roleBuilder : roleBuilder1,
    roleExpansionBuilder : roleExpansionBuilder1,
    roleSweeper : roleSweeper1,
    roleRepair : roleRepair1,
    roleDefender : roleDefender1,
    roleClaimer : roleClaimer1,   
    prototypeMinerSpawn : prototypeMinerSpawn1,
    prototypeMuleSpawn : prototypeMuleSpawn1,
    prototypeCustomSpawn : prototypeCustomSpawn1,
    prototypeDefenderSpawn : prototypeDefenderSpawn1
}