export function initAddressHandler(config, shell, sendMessageFn) {
  const primaryColor = config.widget_config?.primary_color || '#2563eb';

  document.addEventListener('sw:uiaction', (event) => {
    if (event.detail.action === 'confirm_address') {
      const inputRow = shell.inputEl.closest('.sw-input-row');
      let container = document.getElementById('sw-address-confirm');

      if (!container) {
        container = document.createElement('div');
        container.id = 'sw-address-confirm';
        inputRow.parentNode.insertBefore(container, inputRow);
      }

      container.innerHTML = '';
      container.style.display = 'block';
      container.style.padding = '8px 16px';

      const label = document.createElement('label');
      label.textContent = 'Please enter your address:';
      label.style.fontSize = '13px';
      label.style.color = '#6b7280';
      label.style.display = 'block';
      label.style.marginBottom = '6px';

      const addressInput = document.createElement('input');
      addressInput.type = 'text';
      addressInput.id = 'sw-address-input';
      addressInput.placeholder = '123 Main St, City, TX 75001';
      addressInput.style.width = '100%';
      addressInput.style.boxSizing = 'border-box';
      addressInput.style.border = '1px solid #d1d5db';
      addressInput.style.borderRadius = '8px';
      addressInput.style.padding = '10px 14px';
      addressInput.style.fontSize = '14px';
      addressInput.style.outline = 'none';

      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = 'Confirm Address';
      confirmBtn.style.marginTop = '8px';
      confirmBtn.style.width = '100%';
      confirmBtn.style.padding = '10px';
      confirmBtn.style.borderRadius = '8px';
      confirmBtn.style.border = 'none';
      confirmBtn.style.background = primaryColor;
      confirmBtn.style.color = 'white';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.style.fontSize = '14px';
      confirmBtn.style.fontWeight = '600';

      confirmBtn.addEventListener('click', () => {
        const addressValue = addressInput.value.trim();
        if (!addressValue) {
          addressInput.style.border = '1px solid #ef4444';
          return;
        }

        const zipMatch = addressValue.match(/\b(\d{5})\b/);
        const contextObj = { address: addressValue, source: 'address_confirm' };
        if (zipMatch) {
          contextObj.zip = zipMatch[1];
        }

        sendMessageFn(addressValue, contextObj);
        container.style.display = 'none';
        container.innerHTML = '';
      });

      container.appendChild(label);
      container.appendChild(addressInput);
      container.appendChild(confirmBtn);
    } else {
      const container = document.getElementById('sw-address-confirm');
      if (container) {
        container.style.display = 'none';
      }
    }
  });
}
