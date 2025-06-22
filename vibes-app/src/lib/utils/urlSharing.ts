// URL sharing utilities for vibes data

/**
 * Encodes vibes input text to a URL-safe string
 */
export function encodeVibesForUrl(inputText: string): string {
  if (!inputText.trim()) return '';

  try {
    // First encode to UTF-8, then base64 to handle emojis and special characters
    const utf8Bytes = new TextEncoder().encode(inputText);
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    const encoded = btoa(binaryString);
    // Make it URL-safe by replacing characters that might cause issues
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Failed to encode vibes for URL:', error);
    return '';
  }
}

/**
 * Decodes vibes input text from a URL parameter
 */
export function decodeVibesFromUrl(encoded: string): string {
  if (!encoded) return '';

  try {
    // Restore base64 padding and characters
    let restored = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (restored.length % 4) {
      restored += '=';
    }

    // Decode base64 to binary string, then convert back to UTF-8
    const binaryString = atob(restored);
    const utf8Bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      utf8Bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(utf8Bytes);
  } catch (error) {
    console.error('Failed to decode vibes from URL:', error);
    return '';
  }
}

/**
 * Updates the URL with current vibes data without triggering a page reload
 */
export function updateUrlWithVibes(inputText: string): void {
  if (typeof window === 'undefined') return; // SSR safety

  const url = new URL(window.location.href);

  if (inputText.trim()) {
    const encoded = encodeVibesForUrl(inputText);
    if (encoded) {
      url.searchParams.set('vibes', encoded);
    } else {
      url.searchParams.delete('vibes');
    }
  } else {
    url.searchParams.delete('vibes');
  }

  // Update URL without page reload
  window.history.replaceState({}, '', url.toString());
}

/**
 * Gets vibes data from URL parameters
 */
export function getVibesFromUrl(): string {
  if (typeof window === 'undefined') return ''; // SSR safety

  const urlParams = new URLSearchParams(window.location.search);
  const encoded = urlParams.get('vibes');

  if (encoded) {
    return decodeVibesFromUrl(encoded);
  }

  return '';
}

/**
 * Generates a shareable URL for the current vibes
 */
export function generateShareableUrl(inputText: string): string {
  if (typeof window === 'undefined') return ''; // SSR safety

  const url = new URL(window.location.origin + window.location.pathname);
  const encoded = encodeVibesForUrl(inputText);

  if (encoded) {
    url.searchParams.set('vibes', encoded);
  }

  return url.toString();
}

/**
 * Copies the shareable URL to clipboard
 */
export async function copyShareableUrl(inputText: string): Promise<boolean> {
  try {
    const shareableUrl = generateShareableUrl(inputText);
    await navigator.clipboard.writeText(shareableUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy URL to clipboard:', error);
    return false;
  }
}
