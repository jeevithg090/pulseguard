import { useCallback, useEffect, useRef, useState } from 'react';
import { readStorage, writeStorage } from '../utils/storage';

/**
 * `useState` that is initialised from and persisted to localStorage.
 * `initialValue` may be a value or a factory function.
 */
export default function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initialValue === 'function' ? initialValue() : initialValue;
    return readStorage(key, fallback);
  });
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    writeStorage(key, value);
  }, [key, value]);

  const reset = useCallback(() => {
    setValue(typeof initialValue === 'function' ? initialValue() : initialValue);
  }, [initialValue]);

  return [value, setValue, reset];
}
