export let currentUiAction = null;

export function getBookingData() {
  return bookingData;
}

let bookingData = {};
let sendMessage;

export function initChat(config, shell) {
  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'sw-' + Math.random().toString(36).slice(2) + Date.now().toString(36);

  bookingData = {};

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = 'sw-msg ' + (role === 'user' ? 'sw-user' : 'sw-bot');
    div.textContent = text;
    shell.messagesEl.appendChild(div);
    shell.messagesEl.scrollTop = shell.messagesEl.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'sw-msg sw-bot sw-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    shell.messagesEl.appendChild(div);
    shell.messagesEl.scrollTop = shell.messagesEl.scrollHeight;
    return div;
  }

  function removeTyping(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  sendMessage = async function sendMessage(text, contextObj) {
    text = text.trim();
    if (!text) return;

    appendMessage(text, 'user');
    shell.inputEl.value = '';

    const typingEl = showTyping();

    let res;
    try {
      res = await fetch('https://bekxvujhpsygojvvlnxh.supabase.co/functions/v1/cipher-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          location_id: config.location_id,
          booking_data: bookingData,
          context: contextObj || {},
        }),
      });
    } catch (err) {
      removeTyping(typingEl);
      appendMessage('Sorry, something went wrong. Please try again.', 'bot');
      return;
    }

    if (!res.ok) {
      removeTyping(typingEl);
      appendMessage("Sorry, I'm having trouble connecting. Please try again.", 'bot');
      return;
    }

    removeTyping(typingEl);
    const data = await res.json();

    if (data.booking_data) {
      Object.assign(bookingData, data.booking_data);
    }

    appendMessage(data.reply, 'bot');

    currentUiAction = data.ui_action;
    document.dispatchEvent(new CustomEvent('sw:uiaction', {
      detail: { action: data.ui_action, bookingData },
    }));
  };

  // Wire up send button
  shell.sendBtn.addEventListener('click', () => {
    sendMessage(shell.inputEl.value, {});
  });

  // Wire up Enter key
  shell.inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(shell.inputEl.value, {});
    }
  });
}

export { sendMessage };
