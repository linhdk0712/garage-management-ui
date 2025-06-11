import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import AppRoutes from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Providers } from './hooks/useProviders';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Providers>
          <AppRoutes />
        </Providers>
      </Router>
    </ErrorBoundary>
  );
};

export default App;