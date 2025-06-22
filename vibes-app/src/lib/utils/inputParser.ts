import { vibesConfig, getRandomExample } from '../config/defaults.js';

export interface VibeEntry {
  percentage: number;
  label: string;
  id: string;
}

export interface ParseResult {
  entries: VibeEntry[];
  errors: string[];
  isValid: boolean;
  totalPercentage: number;
}

export function parseVibesInput(input: string): ParseResult {
  const lines = input.trim().split('\n').filter(line => line.trim() !== '');
  const entries: VibeEntry[] = [];
  const errors: string[] = [];
  let totalPercentage = 0;

  if (lines.length === 0) {
    return {
      entries: [],
      errors: [],
      isValid: true,
      totalPercentage: 0
    };
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // Match pattern: number (optional %) followed by label
    const match = trimmed.match(/^(\d*\.?\d+)%?\s+(.+)$/);

    if (!match) {
      errors.push(`Line ${index + 1}: Invalid format. Use "percentage label" (e.g., "30 Happy")`);
      return;
    }

    const percentage = parseFloat(match[1]);
    const label = match[2].trim();

    if (isNaN(percentage)) {
      errors.push(`Line ${index + 1}: Invalid percentage "${match[1]}"`);
      return;
    }

    if (percentage < 0) {
      errors.push(`Line ${index + 1}: Percentage cannot be negative`);
      return;
    }

    if (percentage > 100) {
      errors.push(`Line ${index + 1}: Percentage cannot exceed 100%`);
      return;
    }

    if (label.length === 0) {
      errors.push(`Line ${index + 1}: Label cannot be empty`);
      return;
    }

    if (label.length > vibesConfig.ui.maxLabelLength) {
      errors.push(`Line ${index + 1}: Label too long (max ${vibesConfig.ui.maxLabelLength} characters)`);
      return;
    }

    // Check for duplicate labels
    if (entries.some(entry => entry.label.toLowerCase() === label.toLowerCase())) {
      errors.push(`Line ${index + 1}: Duplicate label "${label}"`);
      return;
    }

    entries.push({
      percentage,
      label,
      id: `vibe-${Date.now()}-${index}`
    });

    totalPercentage += percentage;
  });

  // Check if total is approximately 100% (allow small rounding errors)
  const tolerance = vibesConfig.ui.percentageTolerance;
  if (entries.length > 0 && Math.abs(totalPercentage - 100) > tolerance) {
    if (totalPercentage > 100) {
      errors.push(`Total percentage is ${totalPercentage.toFixed(1)}% (exceeds 100%)`);
    } else {
      errors.push(`Total percentage is ${totalPercentage.toFixed(1)}% (should be 100%)`);
    }
  }

  // Limit to reasonable number of entries
  if (entries.length > vibesConfig.ui.maxEntries) {
    errors.push(`Too many entries (maximum ${vibesConfig.ui.maxEntries} allowed)`);
  }

  return {
    entries,
    errors,
    isValid: errors.length === 0,
    totalPercentage
  };
}

export function generateExampleInput(emojiMode: boolean = false): string {
  return getRandomExample(emojiMode);
}
