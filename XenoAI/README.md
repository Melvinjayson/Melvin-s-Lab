# XenoAI - Advanced Multi-Agent AI System

XenoAI is a sophisticated multi-agent AI platform that leverages multiple specialized AI agents working together to process user requests.

## Features

- Multi-agent collaboration with specialized roles (researcher, analyst, creator, etc.)
- Real-time chat interface with Socket.IO
- Knowledge graph for information management
- React frontend with TypeScript
- Express.js backend with PostgreSQL database
- OpenAI integration

## Deployment

This project is configured for deployment on:

- **Frontend**: Vercel (free tier)
- **Backend**: Render (free tier)
- **Database**: Render PostgreSQL (free tier)

### Deployment Instructions

1. **Prepare the repositories**:
   - Push this codebase to a GitHub repository

2. **Deploy the backend and database on Render**:
   - Sign up for a Render account at https://render.com
   - Connect your GitHub repository
   - Use the "Blueprint" deployment option and select the `render.yaml` file
   - This will automatically set up both the API server and PostgreSQL database
   - Add your OpenAI API key to the environment variables

3. **Deploy the frontend on Vercel**:
   - Sign up for a Vercel account at https://vercel.com
   - Import your GitHub repository
   - Vercel will automatically detect the Vite configuration
   - In environment variables, add:
     - `VITE_API_URL=https://xenoai-api.onrender.com`
     - `VITE_WS_URL=wss://xenoai-api.onrender.com`
   - Deploy the application

4. **Connect the services**:
   - Once deployed, update the `CLIENT_URL` environment variable in your Render backend to point to your Vercel frontend URL

## Local Development

1. Install dependencies:
   ```
   npm run install:all
   ```

2. Create a `.env` file in the server directory based on `.env.example`

3. Start the development servers:
   ```
   npm run start
   ```

## Architecture

- **Client**: React + TypeScript frontend using Vite, TailwindCSS, and Socket.IO client
- **Server**: Node.js + Express backend with TypeScript, Socket.IO, and OpenAI integration
- **Database**: PostgreSQL for storing conversations, messages, and knowledge graph data
- **Agent Ecosystem**: Collection of specialized AI agents that collaborate to process user requests

## License

MIT