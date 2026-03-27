export function initCalendar(config, shell, sendMessageFn) {
  if (!config.widget_config?.calendar_enabled) return;

  const dayNameToNum = {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6,
  };

  const rawDays = config.booking_settings?.booking_days || [];
  const allowedDays = rawDays.map(d => dayNameToNum[d.toLowerCase()]).filter(n => n !== undefined);
  const allDaysAllowed = allowedDays.length === 0;

  let displayYear, displayMonth;

  function handleDateSelect(year, month, day) {
    const formatted = new Date(year, month, day).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    sendMessageFn(formatted, { source: 'calendar', date: formatted });
    const container = document.getElementById('sw-calendar');
    if (container) container.style.display = 'none';
  }

  function renderCalendar(container) {
    container.innerHTML = '';

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    // Header
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '8px';
    header.style.fontWeight = '600';
    header.style.fontSize = '14px';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '\u2039';
    prevBtn.style.background = 'none';
    prevBtn.style.border = 'none';
    prevBtn.style.cursor = 'pointer';
    prevBtn.style.fontSize = '18px';
    prevBtn.style.padding = '0 8px';

    const monthLabel = document.createElement('span');
    const monthName = new Date(displayYear, displayMonth, 1).toLocaleDateString('en-US', {
      month: 'long', year: 'numeric',
    });
    monthLabel.textContent = monthName;

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '\u203a';
    nextBtn.style.background = 'none';
    nextBtn.style.border = 'none';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.fontSize = '18px';
    nextBtn.style.padding = '0 8px';

    // Disable prev if at current month
    if (displayYear === todayYear && displayMonth === todayMonth) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.3';
      prevBtn.style.cursor = 'not-allowed';
    }

    prevBtn.addEventListener('click', () => {
      if (displayYear === todayYear && displayMonth === todayMonth) return;
      displayMonth--;
      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }
      renderCalendar(container);
    });

    nextBtn.addEventListener('click', () => {
      displayMonth++;
      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }
      renderCalendar(container);
    });

    header.appendChild(prevBtn);
    header.appendChild(monthLabel);
    header.appendChild(nextBtn);
    container.appendChild(header);

    // Day-of-week headers
    const dowHeader = document.createElement('div');
    dowHeader.style.display = 'grid';
    dowHeader.style.gridTemplateColumns = 'repeat(7, 1fr)';
    dowHeader.style.textAlign = 'center';
    dowHeader.style.fontSize = '11px';
    dowHeader.style.color = '#6b7280';
    dowHeader.style.marginBottom = '4px';

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const label of dayLabels) {
      const cell = document.createElement('div');
      cell.textContent = label;
      dowHeader.appendChild(cell);
    }
    container.appendChild(dowHeader);

    // Days grid
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
    grid.style.gap = '2px';

    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      grid.appendChild(empty);
    }

    // Day buttons
    for (let day = 1; day <= daysInMonth; day++) {
      const btn = document.createElement('button');
      btn.textContent = day;
      btn.style.padding = '6px 0';
      btn.style.borderRadius = '6px';
      btn.style.border = 'none';
      btn.style.fontSize = '13px';
      btn.style.textAlign = 'center';
      btn.style.width = '100%';

      const date = new Date(displayYear, displayMonth, day);
      const dow = date.getDay();
      const isPast = displayYear < todayYear
        || (displayYear === todayYear && displayMonth < todayMonth)
        || (displayYear === todayYear && displayMonth === todayMonth && day <= todayDate);
      const isDayAllowed = allDaysAllowed || allowedDays.includes(dow);

      if (isPast || !isDayAllowed) {
        btn.style.background = '#f3f4f6';
        btn.style.color = '#9ca3af';
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
      } else {
        btn.style.background = 'white';
        btn.style.color = '#111827';
        btn.style.cursor = 'pointer';
        const y = displayYear, m = displayMonth, d = day;
        btn.addEventListener('click', () => handleDateSelect(y, m, d));
      }

      grid.appendChild(btn);
    }

    container.appendChild(grid);
  }

  document.addEventListener('sw:uiaction', (event) => {
    if (event.detail.action === 'show_calendar') {
      const inputRow = shell.inputEl.closest('.sw-input-row');
      let container = document.getElementById('sw-calendar');

      if (!container) {
        container = document.createElement('div');
        container.id = 'sw-calendar';
        inputRow.parentNode.insertBefore(container, inputRow);
      }

      container.innerHTML = '';
      container.style.display = 'block';
      container.style.padding = '8px 16px';

      const now = new Date();
      displayYear = now.getFullYear();
      displayMonth = now.getMonth();

      renderCalendar(container);
    } else {
      const container = document.getElementById('sw-calendar');
      if (container) container.style.display = 'none';
    }
  });
}
