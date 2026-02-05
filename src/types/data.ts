import type { FormItem } from "../types/types";

export const initialForms: FormItem[] = [
  {
    id: "f1",
    title: "Регистрация на конференцию",
    theme: "violet",
    responses: 25,
    createdAt: "2024-05-01",
    lastResponseAt: "2024-06-06",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: "f2",
    title: "Вечеринка выпускников",
    theme: "orange",
    responses: 13,
    createdAt: "2024-04-21",
    lastResponseAt: "2024-05-01",
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "f3",
    title: "Открытый микрофон",
    theme: "violet",
    responses: 8,
    createdAt: "2024-03-12",
    lastResponseAt: "2024-04-20",
    updatedAt: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: "f4",
    title: "Лекция по дизайну",
    theme: "orange",
    responses: 5,
    createdAt: "2024-04-02",
    lastResponseAt: "2024-04-03",
    updatedAt: Date.now() - 1000 * 60 * 6,
  },
];

export const regSeriesBase = [
  5, 9, 7, 11, 14, 12, 16, 18, 21, 19, 23, 26,
] as const;
