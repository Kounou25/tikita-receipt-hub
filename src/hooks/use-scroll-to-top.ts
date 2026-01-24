import { useEffect } from 'react';

/**
 * Hook pour scroll automatiquement en haut de la page au montage du composant
 */
export const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
};
