import useSWR from 'swr';

export type SetDataFunction<T> = (newValue: T) => void;

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, SetDataFunction<T>] => {
  const { data = initialValue, mutate } = useSWR<T>(
    key,
    () => {
      if (typeof window === 'undefined') return initialValue;
      try {
        const storedValue = localStorage.getItem(key);
        return storedValue ? (JSON.parse(storedValue) as T) : initialValue;
      } catch {
        return initialValue;
      }
    },
    {
      fallbackData: initialValue,
    },
  );

  const setData: SetDataFunction<T> = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    mutate(newValue, false);
  };

  return [data, setData];
};
