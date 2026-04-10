export function buildShell(config) {
  const primaryColor = config.widget_config?.primary_color || '#2563eb';
  const greetingMessage = config.widget_config?.greeting_message || 'Hi! How can I help you today?';
  const companyName = config.company_name || 'Chat';

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .sw-bubble {
      position: fixed; bottom: 24px; right: 24px; width: 60px; height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 100%);
      border: none; cursor: pointer; z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(37,99,235,0.4);
      transition: all 0.3s ease;
    }
    .sw-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(37,99,235,0.5); }
    .sw-bubble svg { width: 28px; height: 28px; fill: white; }

    .sw-panel {
      position: fixed; bottom: 100px; right: 24px; width: 380px;
      max-height: calc(100vh - 140px);
      background: white; border-radius: 16px;
      box-shadow: 0 10px 50px rgba(0,0,0,0.15);
      z-index: 99998; display: flex; flex-direction: column; overflow: hidden;
      opacity: 0; visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
      font-family: system-ui, sans-serif;
    }
    .sw-panel.sw-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
    .sw-panel.sw-hidden { opacity: 0; visibility: hidden; transform: translateY(20px) scale(0.95); }

    @media (max-width: 500px) {
      .sw-panel { width: calc(100vw - 16px); right: 8px; bottom: 90px; border-radius: 12px; }
    }

    .sw-header {
      background: linear-gradient(135deg, #1e3a5f 0%, #1e293b 100%);
      color: white; padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .sw-header-info { display: flex; align-items: center; gap: 12px; }
    .sw-avatar {
      width: 40px; height: 40px; background: ${primaryColor}; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 16px; color: white; flex-shrink: 0;
    }
    .sw-header-text h5 { font-size: 14px; font-weight: 600; margin: 0; color: white; }
    .sw-header-status {
      font-size: 12px; opacity: 0.8; display: flex; align-items: center; gap: 6px; margin-top: 2px;
    }
    .sw-status-dot {
      width: 8px; height: 8px; background: #22c55e; border-radius: 50%;
      animation: sw-pulse-dot 2s infinite;
    }
    @keyframes sw-pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

    .sw-close {
      background: rgba(255,255,255,0.1); border: none; width: 32px; height: 32px;
      border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; color: white; font-size: 18px; line-height: 1;
    }
    .sw-close:hover { background: rgba(255,255,255,0.2); }

    .sw-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 4px;
      min-height: 200px; max-height: 400px; background: #fafbfc;
    }
    @keyframes sw-msg-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

    .sw-msg {
      max-width: 85%; padding: 12px 16px; border-radius: 18px;
      font-size: 14px; line-height: 1.5; word-wrap: break-word;
      margin-bottom: 4px;
      animation: sw-msg-in 0.2s ease;
    }
    .sw-msg.sw-bot {
      background: white; color: #111827;
      border: 1px solid #e5e7eb;
      align-self: flex-start; border-bottom-left-radius: 4px;
    }
    .sw-msg.sw-user {
      background: ${primaryColor}; color: white;
      align-self: flex-end; border-bottom-right-radius: 4px;
    }

    .sw-typing {
      display: flex; gap: 4px; align-items: center; padding: 12px 16px;
      background: white; border: 1px solid #e5e7eb;
      border-radius: 18px; border-bottom-left-radius: 4px;
      align-self: flex-start; max-width: 80px;
      animation: sw-msg-in 0.2s ease;
    }
    .sw-typing span {
      width: 8px; height: 8px; border-radius: 50%; background: #9ca3af;
      display: inline-block; animation: sw-bounce 1.2s infinite;
    }
    .sw-typing span:nth-child(2) { animation-delay: 0.2s; }
    .sw-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes sw-bounce { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }

    .sw-input-row {
      padding: 12px 16px; background: white;
      border-top: 1px solid #e5e7eb;
      display: flex; gap: 8px; align-items: center;
    }
    .sw-input {
      flex: 1; border: 1px solid #e5e7eb; border-radius: 24px;
      padding: 12px 18px; font-size: 14px; outline: none;
      resize: none; transition: border-color 0.2s;
      font-family: system-ui, sans-serif;
    }
    .sw-input:focus { border-color: ${primaryColor}; }
    .sw-input:disabled { background: #f9fafb; cursor: not-allowed; }

    .sw-send {
      width: 40px; height: 40px; min-width: 40px;
      background: ${primaryColor}; color: white; border: none;
      border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease;
    }
    .sw-send:hover { filter: brightness(1.1); transform: scale(1.05); }
    .sw-send:disabled { background: #d1d5db; cursor: not-allowed; transform: none; }
    .pac-container { z-index: 99999 !important; }
  `;
  document.head.appendChild(style);

  // Create bubble
  const bubble = document.createElement('button');
  bubble.className = 'sw-bubble';
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';

  // Create panel
  const panel = document.createElement('div');
  panel.className = 'sw-panel';

  const header = document.createElement('div');
  header.className = 'sw-header';

  const headerInfo = document.createElement('div');
  headerInfo.className = 'sw-header-info';

  const avatar = document.createElement('div');
  avatar.className = 'sw-avatar';
  avatar.textContent = companyName[0] || 'S';

  const headerText = document.createElement('div');
  headerText.className = 'sw-header-text';

  const headerTitle = document.createElement('h5');
  headerTitle.textContent = companyName;

  const headerStatus = document.createElement('div');
  headerStatus.className = 'sw-header-status';

  const statusDot = document.createElement('span');
  statusDot.className = 'sw-status-dot';

  const statusText = document.createElement('span');
  statusText.textContent = 'Online';

  headerStatus.appendChild(statusDot);
  headerStatus.appendChild(statusText);

  headerText.appendChild(headerTitle);
  headerText.appendChild(headerStatus);

  headerInfo.appendChild(avatar);
  headerInfo.appendChild(headerText);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'sw-close';
  closeBtn.textContent = '\u00d7';

  header.appendChild(headerInfo);
  header.appendChild(closeBtn);

  const messagesEl = document.createElement('div');
  messagesEl.className = 'sw-messages';
  messagesEl.id = 'sw-messages';

  // Greeting message
  const greeting = document.createElement('div');
  greeting.className = 'sw-msg sw-bot';
  greeting.id = 'sw-greeting';
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
  sendBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';

  inputRow.appendChild(inputEl);
  inputRow.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(messagesEl);
  panel.appendChild(inputRow);

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  // Toggle panel on bubble click
  bubble.addEventListener('click', () => {
    panel.classList.toggle('sw-open');
  });

  // Close panel on close button click
  closeBtn.addEventListener('click', () => {
    panel.classList.remove('sw-open');
  });

  return { panel, header, bubble, messagesEl, inputEl, sendBtn };
}
