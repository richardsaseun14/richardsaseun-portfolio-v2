export const PREF_KEYS = { theme: "rs-theme", sound: "rs-sound", tip: "rs-kb-tip", intro: "rs-intro" } as const;

/** Inline script that runs before first paint so the saved theme never flashes. */
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${PREF_KEYS.theme}')||'light';var d=m==='dark'||(m==='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

/**
 * Inline script that runs before first paint so the intro never flashes when it should be skipped:
 * it only plays when landing on the home page, once per session.
 */
export const introInitScript = `(function(){var d=document.documentElement;if(location.pathname!=='/'){d.dataset.introSeen='1';return;}try{if(sessionStorage.getItem('${PREF_KEYS.intro}')==='1')d.dataset.introSeen='1';}catch(e){}})();`;
