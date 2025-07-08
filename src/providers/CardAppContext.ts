import { createContext, useContext } from 'react';

/* Types */
export type CardAppContextType = {
  sessionInfo: Record<string, string>;
  saveSessionInfo: (payload: Record<string, string>) => void;
  cardAppApiKey: string;
  cardAppApiUrl: string;
};

/* Context */
export const CardAppContext = createContext<CardAppContextType>({
  sessionInfo: {},
  saveSessionInfo: () => {},
  cardAppApiKey: '',
  cardAppApiUrl: '',
});

/* Hook */
export const useCardAppContext = () => {
  return useContext(CardAppContext);
};
