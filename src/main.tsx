import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.tsx';
import { ClinicConfigProvider } from './context/ClinicConfigContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';

import { CurrencyProvider } from './context/CurrencyContext.tsx';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <CurrencyProvider>
      <AuthProvider>
        <ClinicConfigProvider>
          <App />
        </ClinicConfigProvider>
      </AuthProvider>
    </CurrencyProvider>
  </LanguageProvider>
);

