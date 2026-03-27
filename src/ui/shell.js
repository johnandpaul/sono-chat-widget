export function buildShell(config) {
  const primaryColor = config.widget_config?.primary_color || '#2563eb';
  const greetingMessage = config.widget_config?.greeting_message || 'Hi! How can I help you today?';
  const companyName = config.company_name || 'Chat';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .sw-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${primaryColor};
      cursor: pointer;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: none;
    }
    .sw-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    .sw-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      width: 380px;
      height: 560px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      z-index: 99998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: system-ui, sans-serif;
    }
    .sw-panel.sw-hidden {
      display: none;
    }
    .sw-header {
      background: ${primaryColor};
      color: #ffffff;
      padding: 16px 20px;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sw-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    .sw-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .sw-input-row {
      padding: 12px 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .sw-input {
      flex: 1;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      resize: none;
    }
    .sw-send {
      background: ${primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    .sw-msg {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .sw-msg.sw-bot {
      background: #f3f4f6;
      color: #111827;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .sw-msg.sw-user {
      background: ${primaryColor};
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .sw-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 10px 14px;
    }
    .sw-typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      display: inline-block;
      animation: sw-bounce 1.2s infinite;
    }
    .sw-typing span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .sw-typing span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes sw-bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-6px); }
    }
  `;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement('button');
  bubble.className = 'sw-bubble';
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  // Create panel
  const panel = document.createElement('div');
  panel.className = 'sw-panel sw-hidden';

  const header = document.createElement('div');
  header.className = 'sw-header';

  const title = document.createElement('span');
  title.textContent = companyName;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'sw-close';
  closeBtn.textContent = '\u00d7';

  header.appendChild(title);
  header.appendChild(closeBtn);

  const messagesEl = document.createElement('div');
  messagesEl.className = 'sw-messages';
  messagesEl.id = 'sw-messages';

  // Greeting message
  const greeting = document.createElement('div');
  greeting.className = 'sw-msg sw-bot';
  greeting.textContent = greetingMessage;
  messagesEl.appendChild(greeting);

  const inputRow = document.createElement('div');
  inputRow.className = 'sw-input-row';

  const inputEl = document.createElement('textarea');
  inputEl.className = 'sw-input';
  inputEl.id = 'sw-input';
  inputEl.placeholder = 'Type a message...';
  inputEl.rows = 1;

  const sendBtn = document.createElement('button');
  sendBtn.className = 'sw-send';
  sendBtn.id = 'sw-send';
  sendBtn.textContent = 'Send';

  inputRow.appendChild(inputEl);
  inputRow.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(messagesEl);
  panel.appendChild(inputRow);

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  // Toggle panel on bubble click
  bubble.addEventListener('click', () => {
    panel.classList.toggle('sw-hidden');
  });

  // Close panel on close button click
  closeBtn.addEventListener('click', () => {
    panel.classList.add('sw-hidden');
  });

  return { panel, messagesEl, inputEl, sendBtn };
}
