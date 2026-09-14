import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  queryParams: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | null>(null);

function normalizePath(raw: string): string {
  // Check hash first if present (e.g. #/patient)
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1);
  }
  const clean = raw.split('?')[0].split('#')[0];
  if (!clean || clean === '') return '/';
  return clean;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
    };
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#/')) {
        setPath(window.location.hash.slice(1));
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === path) return;
    try {
      window.history.pushState({}, '', to);
      setPath(normalizePath(to));
    } catch {
      // If iframe restricts pushState, use hash fallback
      window.location.hash = `#${to}`;
      setPath(to);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [path]);

  const queryParams = React.useMemo(() => {
    const search = window.location.search;
    const params: Record<string, string> = {};
    const query = new URLSearchParams(search);
    query.forEach((val, key) => {
      params[key] = val;
    });
    return params;
  }, [path]);

  return (
    <RouterContext.Provider value={{ path, navigate, queryParams }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
