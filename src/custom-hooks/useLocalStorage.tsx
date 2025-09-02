import { useEffect, useState } from "react";
interface useLocalStorageProps {
  key: any;
  value: any;
}
export default function useLocalStorage({ key, value }: useLocalStorageProps) {
  const [value1, setValue1] = useState(() => {
    let currValue;
    try {
      currValue = localStorage.getItem(key);
      currValue = currValue ? JSON.parse(currValue) : value;
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
      currValue = value;
    }
    return currValue;
  });

  useEffect(() => {
    localStorage.setItem(String(key), JSON.stringify(value1));
  }, [value1, key]);

  return [value1, setValue1];
}
