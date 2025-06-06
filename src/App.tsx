import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import { FeatureFlagProvider } from './contexts/FeatureFlagContext';
// import { NotificationProvider } from './context/NotificationContext';
// import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Providers } from './hooks/useProviders';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Providers>
          {/* <AuthProvider> */}
            {/* <FeatureFlagProvider> */}
              {/* <NotificationProvider> */}
                {/* <Toaster  */}
                  {/* position="top-right" */}
                  {/* toastOptions={{ */}
                    {/* duration: 4000, */}
                    {/* style: { */}
                      {/* background: '#333', */}
                      {/* color: '#fff', */}
                    {/* }, */}
                  {/* }} */}
                {/* /> */}
                <AppRoutes />
              {/* </NotificationProvider> */}
            {/* </FeatureFlagProvider> */}
          {/* </AuthProvider> */}
        </Providers>
      </Router>
    </ErrorBoundary>
  );
};

export default App;