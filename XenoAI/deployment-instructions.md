# Deployment Instructions for Xeno AI Platform

Follow these step-by-step instructions to deploy the Xeno AI Platform using your GitHub account.

## 1. Create GitHub Repository

1. Go to GitHub and sign in with your account (https://github.com/Melvinjayson)
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter repository name: `xeno-ai-platform`
4. Add a description (optional): "Advanced multi-agent AI system"
5. Select "Public" visibility (unless you have GitHub Pro for private repositories)
6. Check "Add a README file"
7. Click "Create repository"

## 2. Push Local Repository to GitHub

Once the repository is created:

```bash
# From the XenoAI directory
git push -u origin main   # If your branch is named "main"
# OR
git push -u origin master # If your branch is named "master"
```

You'll be prompted to enter your GitHub credentials.

## 3. Deploy Backend and Database on Render

1. Go to https://render.com and sign up/sign in
2. Click "New" and select "Blueprint" from the dropdown
3. Connect your GitHub account if not already connected
4. Find and select the `xeno-ai-platform` repository
5. Render will automatically detect the `render.yaml` file and suggest services to deploy
6. Configure the following environment variables for the API service:
   - `OPENAI_API_KEY`: Your OpenAI API key

7. Click "Apply" to start deployment

Render will automatically:
- Create a PostgreSQL database
- Deploy the API server
- Set up the connection between them

## 4. Deploy Frontend on Vercel

1. Go to https://vercel.com and sign up/sign in
2. Click "Add New" and select "Project"
3. Connect your GitHub account if not already connected
4. Find and select the `xeno-ai-platform` repository
5. Vercel will automatically detect it's a Vite project
6. In the configuration screen:
   - Framework Preset: Vite
   - Root Directory: `./client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   
7. Set the following environment variables:
   - `VITE_API_URL`: Your Render backend URL (e.g., https://xenoai-api.onrender.com)
   - `VITE_WS_URL`: Your Render backend WebSocket URL (e.g., wss://xenoai-api.onrender.com)

8. Click "Deploy"

## 5. Connect Services

After deployment, update the API service on Render:

1. Go to your Render dashboard, select the API service
2. Go to "Environment" section
3. Update `CLIENT_URL` to your Vercel frontend URL (e.g., https://xeno-ai-platform.vercel.app)
4. Click "Save Changes" and wait for the service to redeploy

## 6. Test the Deployed Application

Visit your Vercel URL to verify the application is working correctly.

## Troubleshooting

- If the database connection fails, check the `DATABASE_URL` environment variable in Render
- If the frontend can't connect to the backend, verify the API URLs in Vercel environment variables
- If WebSocket connections fail, make sure your backend allows WebSocket connections

## Additional Information

- Frontend URL: https://xeno-ai-platform.vercel.app
- Backend API URL: https://xenoai-api.onrender.com
- Database: PostgreSQL on Render

Remember that free tier services may have limitations such as:
- Spinning down after periods of inactivity
- Limited database storage
- Limited bandwidth