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

      if (window._sonoMapsReady === true && window.google?.maps?.places) {
        const autocomplete = new google.maps.places.Autocomplete(addressInput, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
        });
        autocomplete.addListener('place_changed', () => {
          const result = autocomplete.getPlace();
          const get = (type, nameType = 'long_name') =>
            result.address_components?.find(c => c.types.includes(type))?.[nameType] || '';
          const street_number = get('street_number');
          const route = get('route');
          const city = get('locality');
          const state = get('administrative_area_level_1', 'short_name');
          const zip = get('postal_code');
          addressInput.value = `${street_number} ${route}, ${city}, ${state} ${zip}`;
          addressInput.dataset.city = city;
          addressInput.dataset.state = state;
          addressInput.dataset.zip = zip;
        });
      }

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

        const contextObj = { address: addressValue, source: 'address_confirm' };
        if (addressInput.dataset.zip) {
          contextObj.zip = addressInput.dataset.zip;
          contextObj.city = addressInput.dataset.city;
          contextObj.state = addressInput.dataset.state;
        } else {
          const zipMatch = addressValue.match(/\b(\d{5})\b/);
          if (zipMatch) contextObj.zip = zipMatch[1];
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
