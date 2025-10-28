# InfluencerHub Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Card.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── influencer/
│   │   │   ├── InfluencerCard.tsx
│   │   │   ├── InfluencerProfile.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   └── ProfileForm.tsx
│   │   └── dashboard/
│   │       ├── Stats.tsx
│   │       ├── RecentActivity.tsx
│   │       └── QuickActions.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   ├── Dashboard.tsx
│   │   ├── InfluencerSearch.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── useApi.tsx
│   │   └── useLocalStorage.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── influencer.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   └── influencer.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── components.css
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Features:
- TypeScript for type safety
- Tailwind CSS for styling with light purple theme
- React Router for navigation
- Context API for state management
- Axios for API calls
- React Hook Form for form handling
- React Hot Toast for notifications
- Responsive design with mobile-first approach
