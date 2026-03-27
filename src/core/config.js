export const config = {};

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
    return;
  }

  let res;
  try {
    res = await fetch('https://bekxvujhpsygojvvlnxh.supabase.co/functions/v1/widget-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });
  } catch (err) {
    console.error('SonoWidget: failed to load config', err);
    return;
  }

  if (!res.ok) {
    console.error('SonoWidget: failed to load config', res.status);
    return;
  }

  const data = await res.json();
  Object.assign(config, data);
  console.log('SonoWidget: config loaded', config);
}
