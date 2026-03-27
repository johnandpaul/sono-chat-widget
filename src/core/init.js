import { config, loadConfig } from './config.js';
import { buildShell } from '../ui/shell.js';
import { initChat } from '../ui/chat.js';

export async function init() {
  await loadConfig();
  const shell = buildShell(config);
  console.log('SonoWidget: shell built');
  initChat(config, shell);
  console.log('SonoWidget: chat engine ready');
  console.log('SonoWidget: ready');
}
