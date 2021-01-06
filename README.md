# Screeps_AI
Screeps_AI is my personal bot used in the game Screeps

## What does Screeps_AI do?

Screeps_AI detects player controlled rooms with a spawn.
Creeps are spawned with body parts based on their intended role and current energy available.
Tower logic applies to all owned towers, attacking enemy creeps, healing friendly creeps if possible, and repairing structures as needed in that order of priority.

# Current creep roles:

# miner 
Locates closest source and harvests energy, if no mules present returns energy to spawn. If mules and containers present, deposits energy into containers.
Miners check the memory of other miners to evenly disperse among sources in given room. 
Miners have 5 work parts, 1 carry part, and 6 move parts. This is efficiently mining out a source in roughly the time it takes to replenish.

# mule 
Locates closest container and withdraws energy, deposits energy into structures that need it.
Mules store targets in memory to prevent more than one mule having any given target. 

# builder 
Searches for construction sites, builds the closest one.
Builders collect energy from nearest container.

# claimer 
Currently a WiP, intended use is to claim 2nd room once available and help bootstrap.

# repair
Searches for structures that lose hits over time. When a structures hits are <85% the structure is saved to memory and the creep begins repairing it.
Once the structures hits are > 95% a new target is set in memory if any are available. This prevents the creep from healing 1 hit and changing targets.
Repair creeps now collect energy from nearest container. 

# sweeper
Searches for ruins that contain energy and gathers any energy. When full, uses mules to offload.
sweepers will not be created if no ruins contain energy, and upon all ruins with energy being depleted they will suicide.

# upgrade
Collects energy from nearest container and upgrades controller with it

# defender
Targets closest hostile creep, move to them and attacks. Body determined on createCustomCreep prototype with attack instead of work, and tough instead of carry. 

## Who can use it
Anyone is free to use this codebase as described in the liscensing
