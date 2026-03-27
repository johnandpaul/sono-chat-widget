import { config, loadConfig } from './config.js';
import { buildShell } from '../ui/shell.js';

export async function init() {
  await loadConfig();
  const shell = buildShell(config);
  console.log('SonoWidget: shell built');
  console.log('SonoWidget: ready');
}
