export interface VibesConfig {
  ui: {
    maxEntries: number;
    maxLabelLength: number;
    percentageTolerance: number;
  };
}

export const vibesConfig: VibesConfig = {
  // UI configuration
  ui: {
    maxEntries: 10,
    maxLabelLength: 50,
    percentageTolerance: 0.1
  }
};

// Helper function to generate a random example
export function getRandomExample(): string {
  // Pool of possible vibes - mix of classic and Gen Z terms
  const vibeWords = [
    // Classic vibes
    'Happy', 'Productive', 'Tired', 'Excited', 'Stressed', 'Calm', 'Creative',
    'Focused', 'Anxious', 'Grateful', 'Energetic', 'Relaxed', 'Curious',
    'Content', 'Motivated', 'Thoughtful', 'Peaceful', 'Inspired', 'Optimistic',
    'Reflective', 'Determined', 'Confident', 'Nervous', 'Joyful', 'Overwhelmed',
    'Satisfied', 'Restless', 'Hopeful', 'Frustrated', 'Serene', 'Melancholy',

    // Gen Z vibes
    'Vibing', 'Salty', 'Lowkey Stressed', 'Highkey Happy', 'Unbothered', 'Thriving',
    'Living My Best Life', 'Main Character Energy', 'Soft Life', 'Hot Girl Summer',
    'Chaotic Good', 'Unhinged', 'Touch Grass', 'No Cap Happy', 'Built Different',
    'Its Giving Anxious', 'Periodt Productive', 'Slay Mode', 'Bussin Energy',
    'Iconic Behavior', 'Chef Kiss Mood', 'Big Brain Time', 'Sending Me',
    'Living Rent Free', 'That Girl Energy', 'Cringe but Free', 'Mid Energy',
    'Fire Mood', 'Slaps Different', 'Hits Hard', 'Goes Brr', 'Sus Vibes',
    'Deadass Tired', 'Periodt Peaceful', 'No Printer Just Facts', 'Valid Feelings',
    'Its Giving Main Character', 'Understood the Assignment', 'Left No Crumbs',
    'Ate and Left No Crumbs', 'Served Looks', 'Spilled Tea', 'Caught in 4K',
    'Living My Truth', 'Gaslight Gatekeep Girlboss', 'Delulu but Happy',
    'Manifestation Mode', 'Universe Aligned', 'Spiritual Gangster'
  ];

  // Generate 3-5 random vibes (max 5 as requested)
  const numVibes = 3 + Math.floor(Math.random() * 3); // 3-5 vibes
  const selectedVibes = [];
  const usedVibes = new Set();

  // Pick random unique vibes
  while (selectedVibes.length < numVibes) {
    const randomVibe = vibeWords[Math.floor(Math.random() * vibeWords.length)];
    if (!usedVibes.has(randomVibe)) {
      usedVibes.add(randomVibe);
      selectedVibes.push(randomVibe);
    }
  }

  // Generate random percentages that add up to 100
  let percentages = [];
  let remaining = 100;

  for (let i = 0; i < numVibes - 1; i++) {
    // Ensure each vibe gets at least 5% and leave room for remaining vibes
    const minPercent = 5;
    const maxPercent = Math.min(50, remaining - (numVibes - i - 1) * minPercent);
    const percent = minPercent + Math.floor(Math.random() * (maxPercent - minPercent + 1));
    percentages.push(percent);
    remaining -= percent;
  }

  // Last vibe gets the remaining percentage
  percentages.push(remaining);

  // Create the example string
  return selectedVibes
    .map((vibe, index) => `${percentages[index]} ${vibe}`)
    .join('\n');
}

// Helper function to get a random color for a vibe
export function getVibeColor(label: string, index: number): string {
  // Generate a random color based on the index and a hash of the label
  // This ensures colors are random but consistent for the same vibe in the same session
  const labelHash = label.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
  }, 0);

  // Use both index and label hash to create variety
  const seed = Math.abs(labelHash) + index * 137;

  // Generate random HSL values
  const hue = (seed * 137.508) % 360;
  const saturation = 65 + (seed * 0.1) % 25; // 65-90%
  const lightness = 45 + (seed * 0.05) % 20; // 45-65%

  return `hsl(${Math.floor(hue)}, ${Math.floor(saturation)}%, ${Math.floor(lightness)}%)`;
}
