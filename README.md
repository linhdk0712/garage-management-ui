# Garage Management System - Frontend

A modern web application for managing garage operations, built with React, TypeScript, and Vite.

## 🚀 Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **UI Library:** Ant Design (antd)
- **State Management:** Redux Toolkit
- **API Client:** Axios
- **Form Handling:** React Hook Form
- **Validation:** Yup
- **Styling:** CSS Modules
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest, React Testing Library

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Modern web browser

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd garage-management-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
VITE_API_BASE_URL=your_api_base_url
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

To create a production build:

```bash
npm run build
# or
yarn build
```

## 🧪 Testing

Run the test suite:

```bash
npm run test
# or
yarn test
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
├── features/        # Feature-based modules
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── store/          # Redux store configuration
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── App.tsx         # Root component
```

## 🔑 Key Features

- User authentication and authorization
- Dashboard with key metrics
- Customer management
- Service booking and tracking
- Vehicle management
- Service history
- Reports and analytics
- Staff management
- Inventory management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for the amazing tools and libraries

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
