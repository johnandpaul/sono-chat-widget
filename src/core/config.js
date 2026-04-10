const CACHE_KEY = 'sw_config_v1';

export const config = {};

export function applyConfig(data) {
  Object.assign(config, data);
}

export async function loadConfig() {
  const scripts = document.querySelectorAll('script');
  let apiKey = null;

  for (const script of scripts) {
    if (script.hasAttribute('data-api-key')) {
      apiKey = script.getAttribute('data-api-key');
      break;
    }
  }

  if (!apiKey) {
    console.error('SonoWidget: no data-api-key found on script tag');
    return false;
  }

  let hasConfig = false;

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      applyConfig(JSON.parse(cached));
      hasConfig = true;
    } catch (_) {
      // ignore malformed cache
    }
  }

  try {
    const res = await fetch('https://bekxvujhpsygojvvlnxh.supabase.co/functions/v1/widget-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });

    if (!res.ok) {
      console.error('SonoWidget: failed to load config', res.status);
    } else {
      const data = await res.json();
      applyConfig(data);
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      hasConfig = true;
      console.log('SonoWidget: config loaded', config);
    }
  } catch (err) {
    console.error('SonoWidget: failed to load config', err);
  }

  return hasConfig;
}
