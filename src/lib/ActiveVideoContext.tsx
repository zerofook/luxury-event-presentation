import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from 'react';

type ActiveVideoContextValue = {
  register: (id: string, el: HTMLVideoElement) => void;
  unregister: (id: string) => void;
  requestPlay: (id: string) => void;
  release: (id: string) => void;
};

const ActiveVideoContext = createContext<ActiveVideoContextValue | null>(null);

export function ActiveVideoProvider({ children }: { children: ReactNode }) {
  const videosRef = useRef(new Map<string, HTMLVideoElement>());
  const activeIdRef = useRef<string | null>(null);

  const pauseAllExcept = useCallback((except: string | null) => {
    for (const [id, v] of videosRef.current) {
      if (id !== except) {
        v.pause();
      }
    }
  }, []);

  const register = useCallback((id: string, el: HTMLVideoElement) => {
    videosRef.current.set(id, el);
  }, []);

  const unregister = useCallback((id: string) => {
    videosRef.current.delete(id);
    if (activeIdRef.current === id) activeIdRef.current = null;
  }, []);

  const requestPlay = useCallback(
    (id: string) => {
      activeIdRef.current = id;
      pauseAllExcept(id);
      const v = videosRef.current.get(id);
      if (v) void v.play().catch(() => {});
    },
    [pauseAllExcept],
  );

  const release = useCallback(
    (id: string) => {
      if (activeIdRef.current === id) activeIdRef.current = null;
      videosRef.current.get(id)?.pause();
    },
    [],
  );

  const value = useMemo(
    () => ({ register, unregister, requestPlay, release }),
    [register, unregister, requestPlay, release],
  );

  return <ActiveVideoContext.Provider value={value}>{children}</ActiveVideoContext.Provider>;
}

export function useActiveVideoRegistry() {
  const ctx = useContext(ActiveVideoContext);
  if (!ctx) throw new Error('ActiveVideoProvider required');
  return ctx;
}
