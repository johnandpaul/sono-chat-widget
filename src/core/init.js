import { loadConfig } from './config.js';

export async function init() {
  await loadConfig();
  console.log('SonoWidget: ready');
}
