# AI Document Assistant Frontend

A modern React TypeScript application for document management and AI-powered document analysis. Built with Vite, Tailwind CSS, and TypeScript for a seamless user experience.

## Overview

This frontend application provides:
- User authentication (Login/Register)
- Document upload and management
- Document viewing and analysis
- Semantic document search
- AI-powered summaries
- Dark mode support
- Responsive design

## Technologies Used

- **React 18+** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **ESLint** - Code linting

## Prerequisites

- Node.js 16.0.0 or higher
- npm 7.0.0 or higher (or yarn, pnpm)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=AI Doc Assistant
```

### 3. Verify Configuration

Check `vite.config.ts` for build and dev server configuration.

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Generated files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── documents/          # Document-related components
│   │   └── UploadModal.tsx
│   ├── layout/             # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Sidebar.tsx
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       └── Toast.tsx
├── contexts/               # React Context providers
│   ├── AuthContext.tsx
│   └── ToastContext.tsx
├── hooks/                  # Custom React hooks
│   └── useDarkMode.ts
├── lib/                    # Utility libraries
│   └── axios.ts
├── pages/                  # Page components
│   ├── DashboardPage.tsx
│   ├── DocumentDetailPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── services/               # API services
│   ├── auth.ts
│   └── documents.ts
├── types/                  # TypeScript type definitions
│   └── index.ts
├── App.tsx                 # Root component
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## Available Scripts

### `npm run dev`
Starts the development server with hot module replacement (HMR).

### `npm run build`
Builds the application for production with optimizations.

### `npm run preview`
Previews the production build locally.

### `npm run lint`
Runs ESLint to check code quality.

```bash
npm run lint
```

### `npm run lint:fix`
Automatically fixes linting issues.

```bash
npm run lint:fix
```

## Key Features

### Authentication
- User registration with email and password
- Secure login with JWT tokens
- Protected routes for authenticated users
- Automatic token refresh

### Document Management
- Upload documents (PDF, DOCX, TXT, etc.)
- View document list with metadata
- Delete documents
- Download documents

### AI Features
- AI-powered document summarization
- Semantic search across documents
- Document preview and reading

### UI/UX
- Dark mode toggle
- Responsive design for mobile and desktop
- Toast notifications for user feedback
- Loading skeletons for better UX
- Intuitive navigation

## API Integration

All API calls are handled through service files in `src/services/`:

### Authentication Service (`auth.ts`)
- User registration
- User login
- Token management

### Documents Service (`documents.ts`)
- Fetch all documents
- Upload documents
- Get document details
- Delete documents
- Search documents
- Generate summaries

### Axios Configuration (`lib/axios.ts`)
- Base URL configuration
- Request/response interceptors
- JWT token injection
- Error handling

## Styling

### Tailwind CSS
Tailwind CSS is configured for utility-first styling. See `tailwind.config.js` for customization.

### Global Styles
Check `src/index.css` for global CSS variables and custom styles.

### Dark Mode
Dark mode is implemented using the `useDarkMode` hook. Toggle with the theme switcher in the sidebar.

## Type Safety

TypeScript types are defined in `src/types/index.ts`. All components and services use proper type annotations.

## Routing

Routes are defined in `App.tsx` and protected with `ProtectedRoute` component:

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Document dashboard (protected)
- `/documents/:id` - Document detail page (protected)

## Components

### UI Components
- **Button** - Customizable button with variants
- **Card** - Container component
- **Input** - Form input field
- **Modal** - Dialog component
- **Skeleton** - Loading placeholder
- **Spinner** - Loading indicator
- **Toast** - Notification component

### Page Components
- **LoginPage** - User login form
- **RegisterPage** - User registration form
- **DashboardPage** - Main document dashboard
- **DocumentDetailPage** - Document view and analysis

## Build Optimization

### Code Splitting
Vite automatically handles code splitting for optimal bundle size.

### Production Build
```bash
npm run build
```

Generates optimized files in `dist/`:
- Minified CSS and JavaScript
- Asset compression
- Source maps

## Testing

Add tests using your preferred testing framework:

```bash
npm install --save-dev vitest @testing-library/react
```

Run tests:
```bash
npm run test
```

## Deployment

### Build the Application
```bash
npm run build
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Push dist folder to Netlify
```

### Docker Deployment
See backend `Dockerfile` for containerized deployment with both frontend and backend.

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### CORS Issues
Ensure the backend is running and CORS is properly configured:
- Check `VITE_API_BASE_URL` environment variable
- Verify backend CORS settings

### Module Not Found
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Fails
Clear Vite cache:
```bash
rm -rf dist .vite
npm run build
```

## Code Quality

### ESLint Configuration
ESLint is configured in `eslint.config.js` to enforce code standards.

### Format Code
```bash
npm run lint:fix
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add new feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
