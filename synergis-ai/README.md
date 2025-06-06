# Synergis AI

An AI-powered, modular automation platform designed to deliver professional consultation and intelligently upsell services or products based on client profiles, needs, and interaction data.

## 🎯 Features

- Automated, context-aware conversations for expert consultations
- Dynamic product/service recommendation engine
- Drag-and-drop dashboard for consultation flows
- CRM and e-commerce platform integration
- Vector-based knowledge base for query logging
- API endpoints for web, chat, and mobile integration

## 🛠 Tech Stack

- **Language Model**: GPT4All, LLaMA3 via Ollama
- **Framework**: LangChain
- **Chat Interface**: Gradio
- **Dashboard**: Appsmith
- **Recommendations**: RecBole
- **Backend**: Supabase
- **Vector Search**: ChromaDB
- **Frontend**: React + Tailwind

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.9
- Ollama (for local LLM)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/synergis-ai.git
cd synergis-ai
```

2. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

5. Start the development servers
```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 📚 Documentation

Detailed documentation is available in the `docs` directory:

- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api-reference.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](docs/contributing.md) first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LangChain](https://github.com/hwchase17/langchain)
- [Ollama](https://github.com/jmorganca/ollama)
- [ChromaDB](https://github.com/chroma-core/chroma)
- [RecBole](https://github.com/RUCAIBox/RecBole)