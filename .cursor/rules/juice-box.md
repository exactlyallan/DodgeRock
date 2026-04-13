# Skill: The Juice Box (Events & SFX)
- **Decoupling:** Entities emit events (e.g., `player.emit('hit')`). They do NOT call the SoundManager directly.
- **Reaction Mapping:** Use a config to map events to reactions. 
  - Event: `EXPLOSION` -> Actions: [Play Sound 'boom', Shake Screen, Spawn Particles].
- **Procedural Audio:** Use the SoundManager's chiptune methods to generate sounds on the fly based on event intensity.