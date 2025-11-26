# Pocket Sentence 📱

Master English, one sentence at a time.

## ✨ Features

- 🎯 **Daily Practice**: Curated English sentences for daily learning
- 🤖 **AI-Powered Generation**: Unlimited practice sentences powered by Google Gemini
- 📊 **Smart Learning**: Spaced repetition system (SRS) for optimal retention
- 🎚️ **Adaptive Levels**: Beginner, Intermediate, and Advanced content
- 🗣️ **Interactive Practice**: Fill-in-the-blank exercises with instant feedback
- 📈 **Progress Tracking**: Monitor your learning streak and mastered sentences
- 🔐 **Secure Authentication**: NextAuth integration for user accounts

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pocket-sentence
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   ```env
   AUTH_SECRET=your_auth_secret_here
   GEMINI_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

4. **Initialize the database**
   ```bash
   npx tsx src/lib/db/seed.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Practice Mode

1. **View Daily Sentences**: Browse your daily practice sentences
2. **Select Difficulty**: Choose Beginner (初級), Intermediate (中級), or Advanced (高級)
3. **Generate New Sentences**: Click "AI 生成新句子" to create unlimited practice content
4. **Study Cards**: Click any sentence to see vocabulary, grammar, and context
5. **Interactive Practice**: Test yourself with fill-in-the-blank exercises

### Dashboard

- Track your learning streak
- View total sentences mastered
- Access learning history
- Monitor progress over time

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with better-sqlite3
- **Authentication**: NextAuth v5
- **AI**: Google Gemini API
- **Animations**: Framer Motion, Canvas Confetti

## 📂 Project Structure

```
pocket-sentence/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── practice/     # Practice page
│   │   ├── dashboard/    # Dashboard page
│   │   └── ...
│   ├── components/       # React components
│   │   └── features/     # Feature-specific components
│   ├── lib/              # Utilities and services
│   │   ├── db/           # Database setup and migrations
│   │   ├── ai-service.ts # Gemini AI integration
│   │   └── srs.ts        # Spaced repetition algorithm
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── pocket.db            # SQLite database
```

## 🤖 AI Sentence Generation

The app uses Google's Gemini API to generate contextually relevant practice sentences:

- **Adaptive Difficulty**: Content matches user's proficiency level
- **Rich Context**: Each sentence includes:
  - Traditional Chinese translation (繁體中文)
  - Key vocabulary with definitions
  - Grammar explanations
  - Real-world usage scenarios
  - Practice contexts
- **Quality Assured**: Structured prompts ensure educational value

## 🧪 Testing

### Manual Testing

Navigate through the app and test features:
```bash
npm run dev
```

### Test AI Generation (Optional)

Use the included test script:
```bash
node test-ai-generation.mjs
```

## 📊 Database

The app uses SQLite for data persistence:

- **Users**: User profiles and preferences
- **Sentences**: Practice content (seed + AI-generated)
- **Learning Records**: SRS tracking and progress
- **Settings**: App configuration

View database contents:
```bash
sqlite3 pocket.db
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AUTH_SECRET` | NextAuth secret for sessions | Yes |
| `GEMINI_KEY` | Google Gemini API key | Yes |
| `GEMINI_MODEL` | Gemini model version | No (default: gemini-2.0-flash-exp) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Google Gemini for AI-powered sentence generation
- Next.js team for the amazing framework
- All contributors and testers

---

Made with ❤️ for English learners
