# Backend - InfluencerHub

Quick test instructions for running the backend and verifying data in MongoDB Compass.

Prerequisites
- Node.js (v18+; you have v22)
- MongoDB running locally (default port 27017)
- Optional: MongoDB Compass GUI

Start the server
1. Open a terminal and change to the `Backend` directory:

```powershell
cd d:\project\InfluencerHub\Backend
```

2. Start the server (use `node` directly if PowerShell blocks `npm` due to execution policy):

```powershell
node server.js
# or, if you prefer nodemon and your system allows npm scripts:
# npm run dev
```

Run the automated test requests
1. From the `Backend` directory run:

```powershell
node testRequests.mjs
```

This script will:
- register a brand user (`brand@test.com`)
- register an influencer user (`infl@test.com`)
- create an influencer profile for the influencer (`test_influencer`)

Verify data in MongoDB Compass
1. Open MongoDB Compass and connect to `mongodb://localhost:27017`.
2. Select the `influencerhub` database.
3. Check collections:
- `users` — should contain the two test users
- `influencerprofiles` — should contain the created profile
- `categories` — contains created categories (e.g., `Fashion`)

Notes
- The backend reads DB URL from `.env` (`MONGO_URI`). By default the project uses `mongodb://127.0.0.1:27017/influencerhub`.
- I added a named `protect` export to `middleware/authMiddleware.js` so both `import auth from ...` and `import { protect } from ...` will work.

If you want, I can:
- Add a small script to clear test data
- Add integration tests that run automatically
