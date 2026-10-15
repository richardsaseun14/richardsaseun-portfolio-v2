export const PREF_KEYS = { theme: "rs-theme", sound: "rs-sound", tip: "rs-kb-tip" } as const;

/** Inline script that runs before first paint so the saved theme never flashes. */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${PREF_KEYS.theme}')||'light';var d=m==='dark'||(m==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;
