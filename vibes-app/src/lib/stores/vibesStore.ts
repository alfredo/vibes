import { writable, derived } from 'svelte/store';
import { parseVibesInput, generateExampleInput, type VibeEntry, type ParseResult } from '../utils/inputParser.js';
import { getVibesFromUrl, updateUrlWithVibes, copyShareableUrl } from '../utils/urlSharing.js';
import { browser } from '$app/environment';

// Input text store - initialize with URL data if available, otherwise use example
function getInitialInputText(): string {
  if (browser) {
    const urlVibes = getVibesFromUrl();
    if (urlVibes) {
      return urlVibes;
    }
  }
  return generateExampleInput();
}

export const inputText = writable(getInitialInputText());

// Sync URL when input changes (only in browser)
if (browser) {
  inputText.subscribe((value) => {
    updateUrlWithVibes(value);
  });
}

// Derived store for parsed vibes data
export const vibesData = derived(
  inputText,
  ($inputText) => parseVibesInput($inputText)
);

// UI state stores
export const isInputFocused = writable(false);
export const showErrors = writable(true);
export const isInputMinimized = writable(true); // Hidden by default

// Re-export the getVibeColor function from config for backwards compatibility
export { getVibeColor } from '../config/defaults.js';

// Actions for the store
export const vibesActions = {
  updateInput: (text: string) => inputText.set(text),
  clearInput: () => inputText.set(''),
  loadExample: () => inputText.set(generateExampleInput()),
  toggleErrors: () => showErrors.update(show => !show),
  setInputFocus: (focused: boolean) => isInputFocused.set(focused),
  toggleInputMinimized: () => isInputMinimized.update(minimized => !minimized),
  shareVibes: async (text: string) => await copyShareableUrl(text)
};
