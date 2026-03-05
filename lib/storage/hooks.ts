'use client';

import { useEffect, useState } from 'react';
import { storage } from './index';

export function useStorage() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    return storage.subscribe(() => {
      forceUpdate({});
    });
  }, []);

  return storage;
}

export function useSettings() {
  const storage = useStorage();
  return storage.getSettings();
}

export function useIsSetupComplete() {
  const storage = useStorage();
  return storage.isSetupComplete();
}

export function useDailyState(date: string) {
  const storage = useStorage();
  const [state, setState] = useState(() => storage.getDailyState(date));

  useEffect(() => {
    return storage.subscribe(() => {
      setState(storage.getDailyState(date));
    });
  }, [date, storage]);

  return state;
}

export function useChoices(date: string) {
  const storage = useStorage();
  const [choices, setChoices] = useState(() => storage.getChoices(date));

  useEffect(() => {
    return storage.subscribe(() => {
      setChoices(storage.getChoices(date));
    });
  }, [date, storage]);

  return choices;
}

export function useDones(date: string) {
  const storage = useStorage();
  const [dones, setDones] = useState(() => storage.getDones(date));

  useEffect(() => {
    return storage.subscribe(() => {
      setDones(storage.getDones(date));
    });
  }, [date, storage]);

  return dones;
}

export function useWeeklyDones(startDate: string) {
  const storage = useStorage();
  const [dones, setDones] = useState(() => storage.getWeeklyDones(startDate));

  useEffect(() => {
    return storage.subscribe(() => {
      setDones(storage.getWeeklyDones(startDate));
    });
  }, [startDate, storage]);

  return dones;
}

export function useStillMoments(date: string) {
  const storage = useStorage();
  const [moments, setMoments] = useState(() => storage.getStillMoments(date));

  useEffect(() => {
    return storage.subscribe(() => {
      setMoments(storage.getStillMoments(date));
    });
  }, [date, storage]);

  return moments;
}

export function useLetGoItems() {
  const storage = useStorage();
  const [items, setItems] = useState(() => storage.getLetGoItems());

  useEffect(() => {
    return storage.subscribe(() => {
      setItems(storage.getLetGoItems());
    });
  }, [storage]);

  return items;
}

export function useOpenListItems() {
  const storage = useStorage();
  const [items, setItems] = useState(() => storage.getOpenListItems());

  useEffect(() => {
    return storage.subscribe(() => {
      setItems(storage.getOpenListItems());
    });
  }, [storage]);

  return items;
}
