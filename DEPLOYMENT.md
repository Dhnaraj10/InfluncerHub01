# Deployment Instructions

This document provides instructions for deploying the InfluencerHub application using the Render CLI.

## Prerequisites

1. Render CLI installed (already installed on your system)
2. A Render account
3. Environment variables configured in Render dashboard

## Manual Deployment Using Render CLI

### 1. Initial Setup

To deploy manually using the Render CLI, you first need to authenticate:

```bash
# If the 'render login' command works on your system
render login
```

If that command doesn't work (as we saw earlier), you can deploy using Git integration:
1. Push your code to GitHub
2. Connect your GitHub repository to Render via the Render dashboard

### 2. Environment Variables

Before deploying, ensure the following environment variables are set in your Render service:

- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `CLOUDINARY_URL` - Your Cloudinary configuration URL
- `NODE_ENV` - Set to "production"
- `PORT` - Set to 10000 (Render's default port)

### 3. Deploy Process

#### Option 1: Deploy via Git (Recommended)
1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Deploy new changes"
   git push origin main
   ```
2. This will automatically trigger a deployment on Render if you have set up Git integration.

#### Option 2: Manual Trigger
If you have Git integration set up, you can manually trigger a deployment:
1. Go to your Render dashboard
2. Navigate to your service
3. Click "Manual Deploy" -> "Deploy latest commit"

### 4. Direct Deployment Commands

If the Render CLI commands work on your system, you can use:

```bash
# Deploy the service (if service ID is known)
render deploys create [SERVICE_ID]

# Or if in the project directory with render.yaml
render init
```

### 5. Checking Deployment Status

You can check the status of your deployment via:
1. Render dashboard
2. Or if CLI commands work:
   ```bash
   render services
   ```

## Troubleshooting

If you encounter issues:
1. Check that all environment variables are properly set
2. Verify your MongoDB connection string is correct
3. Ensure your Cloudinary configuration is valid
4. Check the logs in the Render dashboard for error messages

## Redeploying

To redeploy at will:
1. Make your code changes
2. Commit and push to GitHub
3. Or manually trigger a deploy from the Render dashboard
4. Or use the CLI if available: `render deploys create [SERVICE_ID]`