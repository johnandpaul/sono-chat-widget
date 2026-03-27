export function initPhotoUpload(config, shell, sendMessageFn) {
  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'sw-' + Math.random().toString(36).slice(2) + Date.now().toString(36);

  function appendBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'sw-msg sw-bot';
    div.textContent = text;
    shell.messagesEl.appendChild(div);
    shell.messagesEl.scrollTop = shell.messagesEl.scrollHeight;
  }

  // Hidden file input
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  // Photo button
  const photoBtn = document.createElement('button');
  photoBtn.id = 'sw-photo-btn';
  photoBtn.style.background = 'none';
  photoBtn.style.border = '1px solid #d1d5db';
  photoBtn.style.borderRadius = '8px';
  photoBtn.style.padding = '8px 10px';
  photoBtn.style.cursor = 'pointer';
  photoBtn.style.color = '#6b7280';
  photoBtn.style.display = 'flex';
  photoBtn.style.alignItems = 'center';
  photoBtn.style.gap = '6px';
  photoBtn.style.fontSize = '13px';
  photoBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/></svg>Photo';

  // Insert before textarea in input row
  const inputRow = shell.inputEl.closest('.sw-input-row');
  inputRow.insertBefore(photoBtn, inputRow.firstChild);

  // Trigger file picker
  photoBtn.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    appendBotMessage('Uploading your photo...');

    // Disable photo button
    photoBtn.disabled = true;
    photoBtn.style.opacity = '0.5';
    photoBtn.style.cursor = 'not-allowed';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', sessionId);
    formData.append('location_id', config.location_id);

    let res;
    try {
      res = await fetch('https://bekxvujhpsygojvvlnxh.supabase.co/functions/v1/archive-agent', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      appendBotMessage('Sorry, photo upload failed. Please try again.');
      photoBtn.disabled = false;
      photoBtn.style.opacity = '1';
      photoBtn.style.cursor = 'pointer';
      fileInput.value = '';
      return;
    }

    if (!res.ok) {
      appendBotMessage('Sorry, photo upload failed (status: ' + res.status + ').');
      photoBtn.disabled = false;
      photoBtn.style.opacity = '1';
      photoBtn.style.cursor = 'pointer';
      fileInput.value = '';
      return;
    }

    const data = await res.json();
    sendMessageFn('[Photo uploaded]', {
      photo_url: data.url || data.file_url || null,
      source: 'photo_upload',
    });

    // Re-enable photo button
    photoBtn.disabled = false;
    photoBtn.style.opacity = '1';
    photoBtn.style.cursor = 'pointer';
    fileInput.value = '';
  });
}
