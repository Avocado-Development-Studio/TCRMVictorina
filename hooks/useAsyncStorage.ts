import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseAsyncStorageResult<T> = {
  data: T | undefined;
  setData: (value: T) => Promise<void>;
};

/**
 * Хук, аналогичный useState, но сохраняющий и считывающий значение из AsyncStorage.
 *
 * @template T Тип данных, который будет храниться (например, string, number, объект и т. д.).
 * @param {string} key Ключ, под которым будет сохраняться значение в AsyncStorage.
 * @param {T} [initialValue] Необязательное значение по умолчанию. Если в AsyncStorage нет данных по указанному ключу,
 *                           при первом монтировании хука это значение будет записано в AsyncStorage и установлено в состояние.
 * @returns {{ data: T | undefined; setData: (value: T) => Promise<void> }}
 *          Объект с текущим значением из AsyncStorage (или initialValue) и функцией для его обновления.
 */
export function useAsyncStorage<T>(key: string, initialValue?: T): UseAsyncStorageResult<T> {
  // Локальный стейт для хранения данного ключа
  const [data, setDataState] = useState<T | undefined>(initialValue);

  /**
   * Асинхронная функция загрузки данных из AsyncStorage по ключу.
   * - Если значение найдено, парсит JSON и устанавливает в локальный стейт.
   * - Если значения нет, но передан initialValue, записывает его в AsyncStorage и в стейт.
   *
   * @async
   * @returns {Promise<void>}
   */
  useEffect(() => {
    let isMounted = true;

    async function loadFromStorage() {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        if (jsonValue !== null) {
          // Если в AsyncStorage уже есть сохранённая строка, парсим её
          const parsed: T = JSON.parse(jsonValue);
          if (isMounted) {
            setDataState(parsed);
          }
        } else if (initialValue !== undefined) {
          // Если в хранилище нет данных, а передано initialValue, сохраняем initialValue
          await AsyncStorage.setItem(key, JSON.stringify(initialValue));
          if (isMounted) {
            setDataState(initialValue);
          }
        }
      } catch (e) {
        console.warn(`useAsyncStorage: не удалось загрузить ключ "${key}" из AsyncStorage`, e);
      }
    }

    loadFromStorage();

    return () => {
      isMounted = false;
    };
  }, [key, initialValue]);

  /**
   * Функция для сохранения нового значения в AsyncStorage и обновления локального состояния.
   *
   * @param {T} value Новое значение, которое нужно сохранить (будет сериализовано в JSON).
   * @returns {Promise<void>} Промис, который резолвится после попытки сохранения.
   */
  const setData = useCallback(
    async (value: T) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        setDataState(value);
      } catch (e) {
        console.warn(`useAsyncStorage: не удалось сохранить ключ "${key}" в AsyncStorage`, e);
      }
    },
    [key],
  );

  return {data, setData};
}
