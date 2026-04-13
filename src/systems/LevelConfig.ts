import levelsFile from '../assets/configs/levels.json';

/** One row in `levels.json` — how many rocks this wave sends down the mountain. */
export interface LevelDef {
  id: number;
  boulders: number;
}

export interface LevelsConfigFile {
  levels: LevelDef[];
}

const parsed = levelsFile as LevelsConfigFile;

export function getLevels(): LevelDef[] {
  if (!Array.isArray(parsed.levels) || parsed.levels.length === 0) {
    throw new Error('levels.json must define a non-empty "levels" array.');
  }
  for (const row of parsed.levels) {
    if (typeof row.boulders !== 'number' || row.boulders < 1) {
      throw new Error(`Invalid boulders count for level id ${row.id}`);
    }
  }
  return parsed.levels;
}
