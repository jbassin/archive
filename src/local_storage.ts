import useSWR from 'swr';

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (_: T) => void] => {
  const { data, mutate } = useSWR(key, (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : defaultValue;
  });

  const setData = (data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    mutate(data);
  };

  return [data, setData];
};
