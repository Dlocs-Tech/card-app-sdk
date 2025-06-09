import { createContext, useContext } from 'react';

/* Types */
export type CardAppContextType = {
  sessionInfo: Record<string, string>;
  saveSessionInfo: (payload: Record<string, string>) => void;
  cardAppApiKey: string;
};

/* Context */
export const CardAppContext = createContext<CardAppContextType>({
  sessionInfo: {},
  saveSessionInfo: () => {},
  cardAppApiKey: '',
});

/* Hook */
export const useCardAppContext = () => {
  return useContext(CardAppContext);
};
