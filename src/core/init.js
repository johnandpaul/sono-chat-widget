import { config, loadConfig } from './config.js';
import { buildShell } from '../ui/shell.js';
import { initChat } from '../ui/chat.js';
import { sendMessage } from '../ui/chat.js';
import { initInputControls } from '../ui/input.js';
import { initAddressHandler } from '../features/address.js';
import { initPhotoUpload } from '../features/photo.js';
import { initCalendar } from '../features/calendar.js';

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
  initPhotoUpload(config, shell, sendMessage);
  console.log('SonoWidget: photo upload ready');
  initCalendar(config, shell, sendMessage);
  console.log('SonoWidget: calendar ready');

  // Render opening quick replies if configured
  const oqr = config.widget_config?.opening_quick_replies;
  if (oqr?.enabled && Array.isArray(oqr.items) && oqr.items.length > 0) {
    const maxVisible = oqr.max_visible || 4;
    const visible = oqr.items.slice(0, maxVisible);
    const primaryColor = config.widget_config?.primary_color || '#2563eb';

    const container = document.createElement('div');
    container.id = 'sw-opening-qr';
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.padding = '0 16px 8px';
    container.style.gap = '6px';

    visible.forEach(item => {
      const btn = document.createElement('button');
      btn.textContent = item.label;
      btn.style.padding = '8px 14px';
      btn.style.borderRadius = '20px';
      btn.style.border = '1px solid ' + primaryColor;
      btn.style.background = 'white';
      btn.style.color = primaryColor;
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '13px';
      btn.style.transition = 'all 0.2s';
      btn.addEventListener('click', () => {
        container.remove();
        sendMessage(item.message, {});
      });
      container.appendChild(btn);
    });

    // Insert after the greeting message, before the input row
    const inputRow = shell.inputEl.closest('.sw-input-row');
    inputRow.parentNode.insertBefore(container, inputRow);
  }

  console.log('SonoWidget: opening quick replies ready');
  console.log('SonoWidget: ready');
}
