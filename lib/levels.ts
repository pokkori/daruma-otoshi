export interface Level {
  id: number;
  name: string;
  darumas: number;
  hint: string;
}

export const LEVELS: Level[] = [
  { id: 1, name: "入門", darumas: 3, hint: "まず3段から始めよう" },
  { id: 2, name: "初級", darumas: 4, hint: "リズムよく叩け" },
  { id: 3, name: "中級", darumas: 5, hint: "スピードがカギ" },
  { id: 4, name: "上級", darumas: 6, hint: "素早く正確に" },
  { id: 5, name: "達人", darumas: 7, hint: "全集中で叩け" },
  { id: 6, name: "伝説", darumas: 8, hint: "一撃必殺" },
];

export const DARUMA_EMOJIS = ["", "", "", "", "", "", "", ""];
export const DARUMA_COLORS = [
  "#dc2626", "#ea580c", "#d97706", "#16a34a",
  "#2563eb", "#7c3aed", "#db2777", "#0f172a",
];
