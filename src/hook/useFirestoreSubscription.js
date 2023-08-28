import { useEffect } from 'react';

export const useFirestoreSubscription = (query, callback, dependencies) => {
  useEffect(() => {
    const unsubscribe = query.onSnapshot(callback);
    return () => unsubscribe();
  }, dependencies);
};