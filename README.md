# Vibes Checker 🌈

A beautiful, interactive web application for visualizing your daily mood composition through animated histogram charts. Built with SvelteKit and D3.js.

## ✨ Features

- **Interactive Histogram Charts**: Visualize your daily vibes as stacked bar charts with smooth animations
- **Smart Input Parsing**: Enter vibes in simple format like "30 Happy" or "25% Productive"
- **Random Color Generation**: Each vibe gets a unique, consistent color based on its label
- **URL Sharing**: Share your vibe configurations with others via shareable URLs
- **PNG Export**: Download your vibe charts as high-resolution PNG images
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Real-time Validation**: Instant feedback on input format and percentage totals
- **Gen Z Vocabulary**: Includes modern slang and expressions alongside classic emotions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibes
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
cd vibes-app
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Use

1. **Enter Your Vibes**: Click "Show Input" to reveal the text area
2. **Format Your Data**: Enter each vibe on a new line using the format:
   ```
   30 Happy
   25 Productive
   20 Tired
   15 Excited
   10 Stressed
   ```
3. **Watch the Magic**: The chart updates in real-time with smooth animations
4. **Share or Download**: Use the Share button to get a shareable URL, or Download to save as PNG
5. **Try Examples**: Click "Reload" to generate random example data

## 🎨 Supported Vibe Formats

- `30 Happy` - Basic format
- `25% Productive` - With percentage symbol
- `20.5 Excited` - Decimal percentages
- Supports both classic emotions and Gen Z slang like "Vibing", "Slay Mode", "Main Character Energy"

## 🛠️ Technology Stack

- **Frontend Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Visualization**: [D3.js](https://d3js.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Icons**: [Lucide](https://lucide.dev/)
- **Build Tool**: Vite

## 📁 Project Structure

```
vibes/
├── vibes-app/                 # Main SvelteKit application
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/    # Svelte components
│   │   │   ├── stores/        # Svelte stores for state management
│   │   │   ├── utils/         # Utility functions
│   │   │   └── config/        # Configuration and defaults
│   │   └── routes/            # SvelteKit routes
│   ├── static/               # Static assets
│   └── package.json
├── ai/                       # AI project documentation
├── .gitignore
└── README.md
```

## 🎪 Key Features Explained

### Random Color Generation
Colors are generated using HSL color space with a hash of the vibe label, ensuring:
- Consistent colors for the same vibe across sessions
- Visually appealing color combinations
- High contrast for readability

### URL Sharing
The app automatically encodes your vibe data in the URL using Base64 encoding, allowing you to:
- Share your exact vibe configuration with others
- Bookmark specific vibe combinations
- Restore previous sessions

### Smart Validation
Input validation includes:
- Format checking (percentage + label)
- Duplicate label detection
- Percentage total validation (should sum to 100%)
- Character limits and reasonable constraints

## 🚀 Deployment

The app is ready for deployment on platforms like:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Build for production:
```bash
cd vibes-app
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Acknowledgments

- Inspired by the need to visualize daily emotional states
- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind

---

**What's today's vibes?** 🌟
