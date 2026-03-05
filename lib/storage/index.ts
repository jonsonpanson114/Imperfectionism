import { AppData, STORAGE_KEY, initialData, DailyState, Choice, Done, StillMoment, LetGoItem, OpenListItem } from './types';

export class Storage {
  private static instance: Storage;
  private data: AppData;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.data = this.load();
    // ウィンドウサイズ変更時にリスナーを登録（サーバーサイドレンダリング対応）
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.data = this.load();
        this.notify();
      });
    }
  }

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  private load(): AppData {
    if (typeof window === 'undefined') {
      return initialData;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...initialData, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return { ...initialData };
  }

  private save(): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 設定
  getSettings() {
    return this.data.settings;
  }

  updateSettings(settings: Partial<AppData['settings']> & { birthDate: string }) {
    const current = this.data.settings;
    this.data.settings = {
      ...current,
      ...settings,
      createdAt: current?.createdAt || new Date().toISOString(),
    };
    this.save();
    this.notify();
  }

  // 初回設定済みか
  isSetupComplete(): boolean {
    return this.data.settings !== null;
  }

  // 日次状態
  getDailyState(date: string) {
    return this.data.dailyStates[date] || null;
  }

  updateDailyState(date: string, updates: Partial<DailyState>) {
    this.data.dailyStates[date] = {
      ...this.data.dailyStates[date],
      ...updates,
      date,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    this.notify();
  }

  // 選択
  getChoices(date: string) {
    return this.data.choices.filter(c => c.date === date);
  }

  addChoice(choice: Omit<Choice, 'id' | 'createdAt'>) {
    const newChoice: Choice = {
      ...choice,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.data.choices.push(newChoice);
    this.save();
    this.notify();
    return newChoice;
  }

  updateChoice(id: string, updates: Partial<Choice>) {
    const index = this.data.choices.findIndex(c => c.id === id);
    if (index !== -1) {
      this.data.choices[index] = { ...this.data.choices[index], ...updates };
      this.save();
      this.notify();
    }
  }

  deleteChoice(id: string) {
    this.data.choices = this.data.choices.filter(c => c.id !== id);
    this.save();
    this.notify();
  }

  // 達成
  getDones(date: string) {
    return this.data.dones.filter(d => d.date === date);
  }

  getWeeklyDones(startDate: string) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return this.data.dones.filter(d => {
      const date = new Date(d.date);
      return date >= start && date < end;
    });
  }

  addDone(done: Omit<Done, 'id' | 'createdAt'>) {
    const newDone: Done = {
      ...done,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.data.dones.push(newDone);
    this.save();
    this.notify();
    return newDone;
  }

  deleteDone(id: string) {
    this.data.dones = this.data.dones.filter(d => d.id !== id);
    this.save();
    this.notify();
  }

  // 無為
  getStillMoments(date: string) {
    return this.data.stillMoments.filter(s => s.date === date);
  }

  addStillMoment(moment: Omit<StillMoment, 'id' | 'createdAt'>) {
    const newMoment: StillMoment = {
      ...moment,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.data.stillMoments.push(newMoment);
    this.save();
    this.notify();
    return newMoment;
  }

  // 手放し
  getLetGoItems() {
    return this.data.letGoItems;
  }

  addLetGoItem(item: Omit<LetGoItem, 'id' | 'createdAt'>) {
    const newItem: LetGoItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.data.letGoItems.push(newItem);
    this.save();
    this.notify();
    return newItem;
  }

  updateLetGoItem(id: string, updates: Partial<LetGoItem>) {
    const index = this.data.letGoItems.findIndex(i => i.id === id);
    if (index !== -1) {
      this.data.letGoItems[index] = { ...this.data.letGoItems[index], ...updates };
      this.save();
      this.notify();
    }
  }

  deleteLetGoItem(id: string) {
    this.data.letGoItems = this.data.letGoItems.filter(i => i.id !== id);
    this.save();
    this.notify();
  }

  // 開放式リスト
  getOpenListItems() {
    return this.data.openListItems.filter(i => !i.archived);
  }

  addOpenListItem(item: Omit<OpenListItem, 'id' | 'createdAt' | 'archived'>) {
    const newItem: OpenListItem = {
      ...item,
      id: crypto.randomUUID(),
      archived: false,
      createdAt: new Date().toISOString(),
    };
    this.data.openListItems.push(newItem);
    this.save();
    this.notify();
    return newItem;
  }

  archiveOpenListItem(id: string) {
    const index = this.data.openListItems.findIndex(i => i.id === id);
    if (index !== -1) {
      this.data.openListItems[index].archived = true;
      this.save();
      this.notify();
    }
  }

  deleteOpenListItem(id: string) {
    this.data.openListItems = this.data.openListItems.filter(i => i.id !== id);
    this.save();
    this.notify();
  }
}

// シングルトンインスタンス
export const storage = Storage.getInstance();
