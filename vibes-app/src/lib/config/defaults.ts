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
export function getRandomExample(useEmojis: boolean = false): string {
  // Pool of possible vibes - mix of classic and Gen Z terms
    const vibeWords = useEmojis ? [
    // Single emoji - Positive emotions
    '😊', '🤩', '😄', '🙏', '🌟', '😇', '🌈', '😌', '🙌', '🌺',

    // Single emoji - Energy/Productivity
    '🚀', '⚡', '🎯', '🎨', '🔥', '💯', '💪', '✨', '👑', '💎',

    // Single emoji - Calm/Relaxed
    '🛋️', '☮️', '🧘', '🌸', '💅', '🌙', '🍃', '🕊️', '🌊', '🌿',

    // Single emoji - Contemplative
    '🤔', '💭', '🧐', '🔮', '🌅', '🍂', '📚', '🧠', '🌌', '🎭',

    // Single emoji - Tired/Stressed
    '😴', '😰', '😬', '🤯', '😤', '😵‍💫', '🧂', '😮‍💨', '💤', '🌧️',

    // Two-emoji combinations - Enhanced emotions
    '😊✨', '🚀💯', '😴💤', '🤩🔥', '😰🌧️', '😌🌸', '🎨💡', '🎯⚡',
    '🧘☮️', '🤔💭', '💪👑', '😄🌈', '🔥💎', '🌟✨', '😮‍💨🧂',
    '🦄💫', '🌪️💥', '👸💅', '🌱🌿', '🎵🎭', '💀😂', '👀📸',
    '🏠💕', '📝✅', '🍽️👑', '🔮🌌', '🌅🍂', '💤😴', '🎪🤪'
  ] : [
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

// Darker pastel color palette - 10 distinct colors with better contrast
const PASTEL_COLORS = [
  '#E691C3', // Darker Soft Pink
  '#7DBAED', // Darker Light Blue
  '#9FE67D', // Darker Mint Green
  '#F5C97D', // Darker Peach
  '#C97DE6', // Darker Lavender
  '#F5B07D', // Darker Coral
  '#7DE6C9', // Darker Aqua
  '#E67DB0', // Darker Rose
  '#B07DE6', // Darker Periwinkle
  '#7DE6B0'  // Darker Sage
];

// Emoji mappings for different types of vibes
const EMOJI_MAPPINGS: { [key: string]: string } = {
  // Positive emotions
  'happy': '😊', 'excited': '🤩', 'joyful': '😄', 'grateful': '🙏', 'optimistic': '🌟',
  'thriving': '🌱', 'confident': '💪', 'inspired': '✨', 'hopeful': '🌈', 'satisfied': '😌',
  'content': '😇', 'peaceful': '☮️', 'serene': '🧘', 'blessed': '🙌', 'motivated': '🔥',

  // Energy levels
  'energetic': '⚡', 'productive': '🚀', 'focused': '🎯', 'determined': '💯', 'creative': '🎨',
  'vibing': '🎵', 'bussin energy': '💥', 'fire mood': '🔥', 'slay mode': '👑', 'iconic behavior': '💎',

  // Chill/Relaxed
  'calm': '😌', 'relaxed': '🛋️', 'chill': '😎', 'soft life': '🌸', 'unbothered': '💅',
  'living my best life': '🌺', 'main character energy': '👸', 'that girl energy': '✨',

  // Contemplative
  'thoughtful': '🤔', 'reflective': '💭', 'curious': '🧐', 'contemplative': '🌙',
  'big brain time': '🧠', 'spiritual gangster': '🔮', 'manifestation mode': '🌟',

  // Stressed/Overwhelmed
  'stressed': '😰', 'anxious': '😬', 'overwhelmed': '🤯', 'frustrated': '😤', 'nervous': '😅',
  'tired': '😴', 'exhausted': '💤', 'restless': '😵‍💫', 'salty': '🧂', 'lowkey stressed': '😮‍💨',

  // Neutral/Mixed
  'melancholy': '🌧️', 'nostalgic': '🍂', 'pensive': '🌅', 'bittersweet': '🌗',
  'mid energy': '😐', 'sus vibes': '🤨', 'cringe but free': '🤪', 'delulu but happy': '🦄',

  // Gen Z specific
  'no cap happy': '🚫🧢', 'periodt productive': '💅', 'deadass tired': '💀', 'its giving anxious': '👀',
  'understood the assignment': '📝', 'left no crumbs': '🍽️', 'caught in 4k': '📸', 'sending me': '💀',
  'living rent free': '🏠', 'touch grass': '🌱', 'built different': '🏗️', 'chaotic good': '🌪️'
};

// Helper function to convert a vibe label to emoji if emoji mode is enabled
export function getEmojiForVibe(label: string): string {
  const lowerLabel = label.toLowerCase().trim();

  // Direct match
  if (EMOJI_MAPPINGS[lowerLabel]) {
    return EMOJI_MAPPINGS[lowerLabel];
  }

  // Partial match - check if any key is contained in the label
  for (const [key, emoji] of Object.entries(EMOJI_MAPPINGS)) {
    if (lowerLabel.includes(key) || key.includes(lowerLabel)) {
      return emoji;
    }
  }

  // Default emoji for unknown vibes
  return '💫';
}

// Helper function to get a color for a vibe from the pastel palette
export function getVibeColor(label: string, index: number): string {
  // Use the index to cycle through our predefined palette
  // This ensures consistent colors based on position
  return PASTEL_COLORS[index % PASTEL_COLORS.length];
}
