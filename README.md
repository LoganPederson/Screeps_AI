# Screeps_AI
Screeps_AI is my personal bot used in the game Screeps

## What does Screeps_AI do?

Screeps_AI detects player controlled rooms with a spawn.
Creeps are spawned with body parts based on their intended role and current energy available.
Tower logic applies to all owned towers, attacking enemy creeps, healing friendly creeps if possible, and repairing structures as needed in that order of priority.

# Current creep roles:

# miner 
Locates closest source and harvests energy, if no mules present returns energy to spawn

# mule 
Searches for creeps with memory 'requestingPickup == true', grabs their energy and fills extensions/spawn/tower

# builder 
Searches for construction sites, builds the closest one. Builders will mine their own energy and deliver it themselves.

# claimer 
Currently a WiP, intended use is to claim 2nd room once available and help bootstrap.

# harvester
Depreciated role from tutorial that assisted in created the miner role.

# repair
Searches for structures that lose hits over time. When a structures hits are <85% the structure is saved to memory and the creep begins repairing it.
Once the structures hits are > 95% a new target is set in memory if any are available. This prevents the creep from healing 1 hit and changing targets.

# sweeper
Searches for ruins that contain energy and gathers any energy. When full, uses mules to offload.

# upgrade
Harvests energy and delivers it to room controller

## Who can use it
Anyone is free to use this codebase as described in the liscensing

Testing again whether this is syncing properly to github ~ If so I have everything working as expected.