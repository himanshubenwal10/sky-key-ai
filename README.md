# Sky Key AI - Advanced Gesture & Voice Controlled AI Assistant

A cutting-edge AI assistant application that combines hand gesture recognition, body scanning, voice commands, and intelligent app control with multi-language support.

## Features

✨ **Core Features:**
- 🖐️ Advanced hand gesture recognition
- 🎤 Voice command processing (multi-language)
- 📱 Phone and app control automation
- 👥 Body scanner integration
- 🤖 AI-powered agent assistant
- 🌍 Multi-language support (English, Hindi, Spanish, etc.)
- 🎯 Real-time gesture detection
- 💬 Natural language understanding

## Technology Stack

- **Frontend**: React Native / Flutter
- **Backend**: Node.js / Python
- **AI/ML**: TensorFlow, OpenCV, Mediapipe
- **Voice**: Web Speech API, TensorFlow.js
- **Database**: Firebase / MongoDB
- **Gesture Recognition**: Mediapipe Hands
- **Computer Vision**: OpenCV

## Project Structure

```
sky-key-ai/
├── frontend/                 # Mobile app (React Native/Flutter)
├── backend/                  # API server (Node.js/Python)
├── gesture-recognition/      # Hand & body gesture detection
├── voice-processor/          # Voice command processing
├── ai-agent/                 # AI assistant logic
├── docs/                     # Documentation
├── tests/                    # Test files
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v14+
- Python 3.8+
- React Native CLI / Flutter SDK
- Camera access (for gesture recognition)
- Microphone access (for voice commands)

### Installation

1. Clone the repository
```bash
git clone https://github.com/himanshubenwal10/sky-key-ai.git
cd sky-key-ai
```

2. Install dependencies
```bash
npm install
pip install -r requirements.txt
```

3. Configure environment variables
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

## Usage

### Hand Gesture Commands

| Gesture | Action |
|---------|--------|
| 👋 Wave | Menu Toggle |
| ☝️ Point | Select Item |
| ✌️ Peace | Open App |
| 👍 Thumbs Up | Confirm |
| 👎 Thumbs Down | Reject |
| ✊ Fist | Close/Cancel |

### Voice Commands

```
"Hey Sky Key, open camera"
"Take a screenshot"
"Send message to [contact]"
"Open [app name]"
"Navigate to [location]"
"Play [music/video]"
```

## Architecture

### Gesture Recognition Pipeline
1. Video Capture → Preprocessing → Hand Detection → Gesture Classification → Action Execution

### Voice Processing Pipeline
1. Audio Capture → Speech Recognition → NLP → Intent Detection → Action Execution

### AI Agent Flow
1. User Input (Gesture/Voice) → Intent Recognition → Context Analysis → Action Planning → Execution

## API Endpoints

### Gesture API
```
POST /api/gesture/recognize
GET /api/gesture/supported
```

### Voice API
```
POST /api/voice/process
GET /api/voice/languages
```

### App Control API
```
POST /api/apps/launch
GET /api/apps/list
```

## Configuration

See `config/default.json` for available settings:
- Gesture sensitivity
- Voice language preferences
- App whitelist
- Body scanner settings

## Development

### Running Tests
```bash
npm test
python -m pytest tests/
```

### Building
```bash
npm run build
```

### Contributing
1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Roadmap

- [ ] Core gesture recognition module
- [ ] Voice processing engine
- [ ] AI agent development
- [ ] App control system
- [ ] Multi-language support
- [ ] Body scanner integration
- [ ] Real-time processing optimization
- [ ] Mobile app deployment

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: support@skykeyai.com
- Documentation: https://skykeyai.com/docs

## Authors

- **Himanshu Benwal** - Initial Development

## Acknowledgments

- TensorFlow & MediaPipe communities
- Open source contributors
- AI/ML research community

---

**Version**: 1.0.0  
**Last Updated**: 2026-09-02
