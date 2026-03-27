import { config, loadConfig } from './config.js';
import { buildShell } from '../ui/shell.js';
import { initChat } from '../ui/chat.js';
import { sendMessage } from '../ui/chat.js';
import { initInputControls } from '../ui/input.js';
import { initAddressHandler } from '../features/address.js';

export async function init() {
  await loadConfig();
  const shell = buildShell(config);
  console.log('SonoWidget: shell built');
  initChat(config, shell);
  console.log('SonoWidget: chat engine ready');
  initInputControls(config, shell, sendMessage);
  console.log('SonoWidget: input controls ready');
  initAddressHandler(config, shell, sendMessage);
  console.log('SonoWidget: address handler ready');
  console.log('SonoWidget: ready');
}
