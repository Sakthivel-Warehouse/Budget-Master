# Frontend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure API URL
The app uses `http://localhost:5000/api` by default.

To use a different URL, create `.env` file:
```
REACT_APP_API_URL=http://your-backend-url/api
```

### 3. Start Development Server
```bash
npm start
```

App will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js          # API client config
│   ├── components/           # Reusable components
│   ├── context/              # React context (Auth)
│   ├── hooks/                # Custom hooks
│   ├── pages/                # Page components
│   ├── App.js                # Main app component
│   ├── index.js              # Entry point
│   └── index.css             # Global styles
├── package.json
├── tailwind.config.js        # Tailwind config
└── postcss.config.js         # PostCSS config
```

## Available Scripts

### `npm start`
Runs development server at http://localhost:3000

### `npm run build`
Builds optimized production build

### `npm test`
Runs test suite (if configured)

## Components Overview

### Pages
- **Login.js** - User login page
- **Signup.js** - User registration with OTP
- **Dashboard.js** - Main dashboard

### Components
- **Navbar.js** - Top navigation
- **MemberDashboard.js** - Member view
- **AdminDashboard.js** - Admin panel
- **ExpenseForm.js** - Create expense
- **ExpenseList.js** - View expenses
- **ExpenseSummary.js** - Financial summary
- **PendingSignups.js** - Admin OTP list
- **MemberList.js** - Member cards

### Context
- **AuthContext.js** - Authentication state management

### Hooks
- **useAuth.js** - Custom hook for auth context

## Features

### Member Features
✅ OTP-based signup
✅ Post expenses with invoice image
✅ Select members to split with
✅ Auto-calculate individual shares
✅ Track payment status
✅ View expense summary
✅ See total spent/owed/balance

### Admin Features
✅ Add members manually
✅ View pending OTP signups
✅ Copy and share OTPs
✅ Manage member list
✅ View admin dashboard
✅ See system stats

## Styling

### Tailwind CSS
- Pre-configured with all utilities
- Custom config in `tailwind.config.js`
- Responsive design (mobile-first)

### Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)

## Form Handling

All forms use React hooks for state management:
```javascript
const [formData, setFormData] = useState({...});

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
```

## Error Handling

- Toast notifications for user feedback
- Try-catch in async operations
- Error boundary for component errors
- Fallback UI for loading states

## API Integration

### Axios Configuration
- Base URL configured in `src/api/axios.js`
- Automatic JWT token attachment
- Request/response interceptors

### Making API Calls
```javascript
import axiosInstance from '../api/axios';

const response = await axiosInstance.get('/endpoint');
const response = await axiosInstance.post('/endpoint', data);
```

## Authentication Flow

1. User logs in/signs up
2. JWT token stored in localStorage
3. Token added to all API requests
4. Token validation on protected routes
5. Auto logout on invalid token

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React Router
- Image optimization
- CSS minification (production)
- Bundle size monitoring

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy 'build' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy 'build' folder to GitHub Pages
```

### Custom Server
```bash
npm run build
# Serve 'build' folder with your web server
```

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
```

Note: Variables must start with `REACT_APP_` to be accessible

## Development Tips

### Debug Mode
Open browser DevTools:
- Chrome: F12
- Firefox: F12
- Safari: Cmd+Option+I

### React DevTools
Install React DevTools browser extension for component inspection

### Network Debugging
Use DevTools Network tab to monitor API calls

## Troubleshooting

### Port 3000 Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Blank Page After Build
- Check browser console for errors
- Verify API URL is correct
- Clear browser cache
- Rebuild project: `npm run build`

### API Calls Failing
- Check backend is running
- Verify API URL in .env
- Check CORS configuration on backend
- Look at Network tab in DevTools

### Styling Issues
- Clear node_modules and reinstall
- Restart dev server
- Check tailwind.config.js syntax
- Verify CSS imports

## Common Issues

### Token Not Being Sent
Check if token is in localStorage:
```javascript
console.log(localStorage.getItem('token'));
```

### Redirect Loop on Login
- Check ProtectedRoute logic
- Verify token validation
- Check URL paths

### Form Not Submitting
- Check console for errors
- Verify form validation
- Check API endpoint
- Look at network requests

## Performance Tips

- Lazy load components with React.lazy()
- Use useMemo/useCallback for expensive operations
- Minimize re-renders
- Optimize images
- Code split at route level

## Resources

- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Axios: https://axios-http.com
- React Router: https://reactrouter.com
- Lucide Icons: https://lucide.dev

## Support

For issues, check:
1. Browser console for errors
2. Network tab for API failures
3. Backend logs for server errors
4. GitHub issues in repository
