# MEMORY.md

## Known Codebase Facts

- Widget ships as a single bundled IIFE — dist/widget.js. Never split into multiple output files.
- All styles live in shell.js as an injected <style> tag. No external CSS file exists or should ever be added.
- sw:uiaction is the custom DOM event connecting chat.js to all feature modules. Any new UI feature must listen for this event — do not create alternative communication patterns.
- Z-index hierarchy: bubble = 99999, panel = 99998, Maps .pac-container = 100000. Never change one without updating all three.
- booking_mode has three values: none, simple, staff. Staff mode is a stub — not functional. Do not build on it without explicit instruction.
- Multi-tenant architecture is in place via API key + business_config. DTF is the only active client. No Client 2 exists yet.
- Input disabling during steps is controlled by disable_input_during_steps in widget_config. Current DTF steps: show_services, show_calendar, show_timeslots, show_address.
- The Gemini/Maps API key has Application restrictions set to None — it is server-side, called from Supabase Edge Functions. Do not add referrer restrictions.

## Session Learnings
(empty — append here using "remember that..." prompts during sessions)
