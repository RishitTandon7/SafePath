# SafePath AI 🛡️

**Safe Navigation for All** - An AI-powered navigation application that prioritizes user safety by providing intelligent route recommendations based on real-time safety data, community reports, and environmental factors.

![SafePath AI](https://img.shields.io/badge/SafePath-AI-blue?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

### 🗺️ **Smart Navigation**
- **Safest Route Planning**: AI-powered algorithms calculate the safest paths considering lighting, crime data, and police proximity
- **Real-time Safety Scoring**: Dynamic safety assessment for every location
- **Multiple Route Options**: Choose between safest and fastest routes with detailed comparisons
- **Turn-by-turn Navigation**: Live navigation with safety-focused directions

### 🔒 **Safety Features**
- **Safety Heatmap**: Visual representation of area safety levels
- **Community Reports**: Anonymous incident reporting system
- **Emergency Panic Button**: One-touch emergency contact alerts
- **Live Location Tracking**: Real-time location monitoring for safety

### 🤖 **AI Assistant**
- **SafePath Chatbot**: Intelligent assistant for safety queries and guidance
- **Contextual Help**: Location-aware safety recommendations
- **Emergency Support**: Immediate assistance during safety concerns

### 📊 **Analytics Dashboard**
- **Safety Statistics**: Comprehensive safety analytics and trends
- **Report Management**: View and analyze community safety reports
- **Hotspot Identification**: Identify and track safety hotspots
- **Trend Analysis**: Historical safety data and improvement tracking

### 🎨 **User Experience**
- **Google Maps-Style Interface**: Familiar and intuitive design
- **Multiple Map Views**: Default, Satellite, and Terrain perspectives
- **Responsive Design**: Optimized for desktop and mobile devices
- **Accessibility First**: Built with accessibility best practices

## 🚀 Live Demo

Visit the live application: **[SafePath AI](https://safepathai.netlify.app)**

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- TomTom API key (optional, for enhanced features)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/safepath-ai.git
   cd safepath-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   ```
   
   Add your TomTom API key to `.env`:
   ```env
   VITE_TOMTOM_API_KEY=your_tomtom_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_TOMTOM_API_KEY` | TomTom API key for enhanced geocoding and routing | No* |

*The app works without the API key using mock data, but real geocoding requires the TomTom API key.

### Getting TomTom API Key

1. Visit [TomTom Developer Portal](https://developer.tomtom.com/)
2. Create a free account
3. Generate an API key
4. Add it to your `.env` file

## 📖 Usage Guide

### 🎯 **Finding Safe Routes**

1. **Click "Get Directions"** or use the search interface
2. **Enter your destination** with auto-complete suggestions
3. **Choose route type**:
   - 🛡️ **Safest Route**: Prioritizes safety factors
   - ⚡ **Fastest Route**: Optimizes for travel time
4. **Start Navigation** for turn-by-turn directions

### 📍 **Reporting Safety Issues**

1. Click the **"Report"** button in the header
2. Select issue type (harassment, poor lighting, crime, etc.)
3. Add description and severity level
4. Submit anonymous report to help the community

### 🚨 **Emergency Features**

- **Panic Button**: Red emergency button for immediate help
- **Auto-location sharing**: Sends location to emergency contacts
- **Quick access**: Always visible for emergency situations

### 📊 **Safety Dashboard**

- View community safety statistics
- Analyze safety trends and hotspots
- Track improvement metrics
- Access detailed safety reports

## 🏗️ Project Structure

```
safepath-ai/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── Chat/          # AI chatbot components
│   │   ├── Dashboard/     # Analytics dashboard
│   │   ├── Layout/        # Header, sidebar components
│   │   ├── Map/           # Map and navigation components
│   │   ├── Navigation/    # Navigation components
│   │   ├── Reports/       # Incident reporting
│   │   └── Safety/        # Safety-specific components
│   ├── contexts/          # React contexts
│   │   ├── LocationContext.tsx    # Location tracking
│   │   └── SafetyProvider.tsx     # Safety data management
│   ├── services/          # API services
│   │   └── tomtom.ts      # TomTom API integration
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🛡️ Safety & Privacy

### Data Privacy
- **Anonymous Reporting**: All safety reports are completely anonymous
- **Local Storage**: Personal preferences stored locally
- **No Personal Data**: We don't collect personal information without consent

### Security Features
- **End-to-end Encryption**: All communications are encrypted
- **Secure APIs**: All external API calls are properly secured
- **Privacy First**: Built with privacy-by-design principles

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Ensure accessibility compliance
- Write clear, descriptive commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for map data
- **TomTom** for geocoding and routing services
- **Leaflet** for map rendering
- **React Community** for the amazing ecosystem
- **Safety Advocates** who inspired this project

## 📞 Support

- 📧 **Email**: support@safepath.ai
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/safepath-ai/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/safepath-ai/discussions)

## 🔮 Roadmap

### Upcoming Features
- [ ] **Machine Learning Integration** for better safety predictions
- [ ] **Community Moderation** system for reports
- [ ] **Mobile App** for iOS and Android
- [ ] **Multi-language Support** for global accessibility
- [ ] **Integration with Emergency Services**
- [ ] **Wearable Device Support**

---

**SafePath AI** - *Making the world a safer place, one route at a time.* 🛡️

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/safepath-ai)
