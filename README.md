# Garage Management System - Frontend

A modern, responsive web application for managing garage operations, built with React 19, TypeScript, and Vite. Features a beautiful UI with Tailwind CSS and Radix UI components.

## 🚀 Tech Stack

### Core Framework
- **React 19** - Latest React with concurrent features and improved performance
- **TypeScript 5.7** - Type-safe JavaScript development
- **Vite 6.2** - Lightning-fast build tool and development server

### UI & Styling
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI primitives
  - Dialog, Dropdown Menu, Label, Popover, Select, Separator, Tabs, Toast
- **Lucide React** - Beautiful, customizable icons
- **Headless UI** - Unstyled, accessible UI components

### State Management & Data
- **React Hook Form 7.54** - Performant forms with easy validation
- **Zod 3.24** - TypeScript-first schema validation
- **Axios 1.8** - HTTP client for API communication
- **JWT Decode** - Client-side JWT token handling

### Routing & Navigation
- **React Router DOM 7.3** - Declarative routing for React

### Date & Time
- **Day.js 1.11** - Lightweight date manipulation library
- **Date-fns 4.1** - Modern JavaScript date utility library
- **React Day Picker 9.7** - Flexible date picker component

### Charts & Visualization
- **Recharts 2.15** - Composable charting library built on React components

### Utilities
- **Lodash 4.17** - JavaScript utility library
- **Class Variance Authority** - Type-safe component variant API
- **clsx & classnames** - Conditional className utilities
- **Tailwind Merge** - Efficiently merge Tailwind CSS classes

### Development Tools
- **ESLint 9.21** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📋 Prerequisites

- **Node.js 18** or higher
- **npm** or **yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd garage-management-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=Garage Management System
   ```

## 🚀 Development

### Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# TypeScript
npm run type-check   # Check TypeScript types
```

## 🏗️ Project Structure

```
src/
├── api/             # API service layer and HTTP clients
├── assets/          # Static assets (images, fonts, icons)
├── components/      # Reusable UI components
│   ├── ui/         # Base UI components (buttons, inputs, etc.)
│   └── layout/     # Layout components
├── config/          # Application configuration
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and configurations
├── pages/           # Page components and routing
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
├── App.tsx          # Root application component
├── main.tsx         # Application entry point
└── routes.tsx       # Route definitions
```

## 🎨 UI Components

The application uses a modern component architecture:

### Base Components
- **Button** - Variant-based button component
- **Input** - Form input with validation
- **Card** - Content container component
- **Dialog** - Modal dialogs and overlays
- **Toast** - Notification system

### Layout Components
- **Header** - Application header with navigation
- **Sidebar** - Navigation sidebar
- **Footer** - Application footer

### Form Components
- **Form** - React Hook Form integration
- **DatePicker** - Date selection component
- **Select** - Dropdown selection component

## 🔑 Key Features

### Authentication & Authorization
- JWT-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh

### Dashboard & Analytics
- Real-time dashboard with key metrics
- Interactive charts and graphs
- Performance analytics
- Customizable widgets

### Customer Management
- Customer profiles and history
- Contact information management
- Service history tracking
- Customer communication tools

### Service Management
- Service booking and scheduling
- Service status tracking
- Work order management
- Service history and reports

### Vehicle Management
- Vehicle registration and profiles
- Service history per vehicle
- Maintenance scheduling
- Vehicle documentation

### Staff Management
- Employee profiles and roles
- Work schedule management
- Performance tracking
- Access control

### Inventory Management
- Parts and supplies tracking
- Stock level monitoring
- Purchase order management
- Inventory reports

## 🎯 Design System

The application follows a consistent design system:

### Colors
- Primary: Blue shades for main actions
- Secondary: Gray shades for supporting elements
- Success: Green for positive actions
- Warning: Yellow for caution
- Error: Red for errors and destructive actions

### Typography
- Clean, readable font stack
- Consistent heading hierarchy
- Proper line heights and spacing

### Spacing
- Consistent spacing scale
- Responsive padding and margins
- Grid-based layouts

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile devices (320px - 767px)

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      }
    }
  },
  plugins: []
}
```

## 🧪 Testing

### Unit Testing
```bash
npm run test
```

### Component Testing
```bash
npm run test:components
```

### E2E Testing
```bash
npm run test:e2e
```

## 📦 Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

- **HTTPS Only** - Secure communication
- **JWT Token Management** - Secure token handling
- **Input Validation** - Client-side validation with Zod
- **XSS Protection** - Built-in React protection
- **CSRF Protection** - Token-based protection

## 🚀 Performance Optimizations

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Component lazy loading
- **Image Optimization** - Optimized image loading
- **Bundle Analysis** - Webpack bundle analyzer
- **Caching** - Browser caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful component names
- Add proper TypeScript types
- Follow the established folder structure
- Use consistent code formatting
- Write tests for new features

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- React Team for the amazing framework
- Vite Team for the fast build tool
- Tailwind CSS Team for the utility-first CSS framework
- Radix UI Team for accessible components
- All contributors and maintainers

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team
- Review the API documentation

## 🔗 Related Projects

- [Garage Management Service](https://github.com/your-org/garage-management-service) - Backend API
- [Garage Management Mobile](https://github.com/your-org/garage-management-mobile) - Mobile app (if applicable)
