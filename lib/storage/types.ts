// 設定データ
export interface Settings {
  birthDate: string;           // 誕生日（YYYY-MM-DD）
  name?: string;               // 名前（任意）
  createdAt: string;
}

// 日次状態
export interface DailyState {
  date: string;                // YYYY-MM-DD
  mood: 'normal' | 'anxious' | 'tired' | 'confused' | 'calm' | null;
  updatedAt: string;
}

// 日次進捗
export interface DailyProgress {
  date: string;
  currentStep: 1 | 2 | 3;
  step1Completed: boolean;  // 気分選択完了
  step2Completed: boolean;  // 選択完了
  step3Completed: boolean;  // 達成完了
}

// 選択（やる/やらない/受け入れる）
export interface Choice {
  id: string;
  date: string;
  type: 'todo' | 'notodo' | 'accept';
  content: string;
  completed: boolean;
  createdAt: string;
}

// 達成（やったこと）
export interface Done {
  id: string;
  date: string;
  content: string;
  feeling?: string;
  createdAt: string;
}

// 無為（何もしない）
export interface StillMoment {
  id: string;
  date: string;
  durationMinutes: number;
  note?: string;
  createdAt: string;
}

// 手放しリスト
export interface LetGoItem {
  id: string;
  content: string;
  letGoAt: string;            // YYYY-MM-DD
  initialFeeling?: string;
  laterFeeling?: string;
  laterNote?: string;
  createdAt: string;
}

// 開放式リスト（アイデア）
export interface OpenListItem {
  id: string;
  content: string;
  archived: boolean;
  createdAt: string;
}

// 全体データ
export interface AppData {
  settings: Settings | null;
  dailyStates: Record<string, DailyState>;  // key: date
  dailyProgress: Record<string, DailyProgress>;  // key: date
  choices: Choice[];
  dones: Done[];
  stillMoments: StillMoment[];
  letGoItems: LetGoItem[];
  openListItems: OpenListItem[];
}

// LocalStorageキー
export const STORAGE_KEY = 'the-incomplete-data';

// 初期データ
export const initialData: AppData = {
  settings: null,
  dailyStates: {},
  dailyProgress: {},
  choices: [],
  dones: [],
  stillMoments: [],
  letGoItems: [],
  openListItems: [],
};
