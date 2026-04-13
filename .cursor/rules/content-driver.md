# Skill: Data-Driven Content
- **Markdown Players:** Treat `.md` files in `/assets/players/` as entities. Parse YAML frontmatter for stats (speed, jump) and use the body for descriptions.
- **Config Over Code:** If it's a number (gravity, spawn rate), it belongs in a JSON/YAML config. 
- **Validation:** When adding new data types, ensure there's a TypeScript Interface that matches the config schema.