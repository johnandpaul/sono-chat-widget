export function initInputControls(config, shell, sendMessageFn) {
  const disableSteps = config.widget_config?.disable_input_during_steps || [];
  const quickRepliesEnabled = config.widget_config?.opening_quick_replies?.enabled || false;
  const primaryColor = config.widget_config?.primary_color || '#2563eb';

  function setInputEnabled(enabled) {
    shell.inputEl.disabled = !enabled;
    shell.sendBtn.disabled = !enabled;
    shell.inputEl.style.opacity = enabled ? '1' : '0.5';
    shell.sendBtn.style.opacity = enabled ? '1' : '0.5';
    shell.sendBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }

  function renderQuickReplies(replies) {
    let container = document.getElementById('sw-quick-replies');
    const inputRow = shell.inputEl.closest('.sw-input-row');

    if (!container) {
      container = document.createElement('div');
      container.id = 'sw-quick-replies';
      inputRow.parentNode.insertBefore(container, inputRow);
    }

    container.innerHTML = '';

    if (!replies || replies.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.padding = '8px 16px 0';

    for (const reply of replies) {
      const btn = document.createElement('button');
      btn.style.margin = '4px';
      btn.style.padding = '8px 14px';
      btn.style.borderRadius = '20px';
      btn.style.border = '1px solid ' + primaryColor;
      btn.style.background = 'white';
      btn.style.color = primaryColor;
      btn.style.cursor = 'pointer';
      btn.style.fontSize = '13px';
      btn.textContent = reply;
      btn.addEventListener('click', () => {
        sendMessageFn(reply, {});
        renderQuickReplies([]);
      });
      container.appendChild(btn);
    }
  }

  document.addEventListener('sw:uiaction', (event) => {
    if (disableSteps.includes(event.detail.action)) {
      setInputEnabled(false);
    } else {
      setInputEnabled(true);
    }

    if (quickRepliesEnabled) {
      renderQuickReplies(event.detail.quick_replies || []);
    }
  });

  setInputEnabled(true);
}
