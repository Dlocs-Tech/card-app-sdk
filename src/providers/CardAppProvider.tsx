import type { ReactNode } from 'react';
import { useState } from 'react';
import { CardAppContext } from './CardAppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Constants */
const queryClient = new QueryClient();

/* Types */
export type CardAppProviderProps = {
  children: ReactNode;
  cardAppApiKey: string;
  cardAppApiUrl: string;
};

/* Provider */
export const CardAppProvider = ({
  children,
  cardAppApiKey,
  cardAppApiUrl,
}: CardAppProviderProps) => {
  const [sessionInfo, setSessionInfo] = useState<Record<string, string>>({});

  const saveSessionInfo = (sessionInfo: Record<string, string>) => {
    setSessionInfo(sessionInfo);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CardAppContext.Provider
        value={{
          sessionInfo,
          saveSessionInfo,
          cardAppApiKey,
          cardAppApiUrl,
        }}
      >
        {children}
      </CardAppContext.Provider>
    </QueryClientProvider>
  );
};
