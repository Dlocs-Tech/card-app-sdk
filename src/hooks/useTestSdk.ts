import { useCallback } from "react";

/**
 * Hook to test the sdk
 * @todo Remove this hook and use the sdk directly
 * @returns {Object} - Object with the handleTestSdk function
 */
export default function useTestSdk() {

  /* Callbacks */
  const handleTestSdk = useCallback(() => {
    console.log("test sdk");
  }, []);

  /* Return */
  return { handleTestSdk };
};