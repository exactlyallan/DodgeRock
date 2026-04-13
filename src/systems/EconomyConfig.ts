import economyFile from '../assets/configs/economy.json';

export interface EconomyConfig {
  /** 0–1 chance each time a boulder bounces (mountain or hard ground hit). */
  coinDropChanceOnImpact: number;
}

const parsed = economyFile as EconomyConfig;

export function getEconomyConfig(): EconomyConfig {
  const p = parsed.coinDropChanceOnImpact;
  if (typeof p !== 'number' || p < 0 || p > 1) {
    throw new Error('economy.json: coinDropChanceOnImpact must be a number from 0 to 1.');
  }
  return parsed;
}
