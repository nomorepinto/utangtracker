import { User, Utang } from "./types";

export const mockUsers: User[] = [
  {
    id: 1,
    created_at: "2025-11-15T08:30:00Z",
    name: "Maria Santos",
    payment_score: 85,
    password_hash: "hashed_password_1",
  },
  {
    id: 2,
    created_at: "2025-12-01T10:00:00Z",
    name: "Juan Dela Cruz",
    payment_score: 62,
    password_hash: "hashed_password_2",
  },
  {
    id: 3,
    created_at: "2026-01-10T14:20:00Z",
    name: "Ana Reyes",
    payment_score: 93,
    password_hash: "hashed_password_3",
  },
  {
    id: 4,
    created_at: "2026-01-25T09:15:00Z",
    name: "Carlos Garcia",
    payment_score: 45,
    password_hash: "hashed_password_4",
  },
  {
    id: 5,
    created_at: "2026-02-05T16:45:00Z",
    name: "Bea Villanueva",
    payment_score: 78,
    password_hash: "hashed_password_5",
  },
];

export const mockUtangs: Utang[] = [
  {
    id: 1,
    created_at: "2025-11-20T09:00:00Z",
    amount: 1500.0,
    date: "2025-12-20",
    user_id: 1,
  },
  {
    id: 2,
    created_at: "2025-12-05T11:30:00Z",
    amount: 3200.5,
    date: "2026-01-05",
    user_id: 1,
  },
  {
    id: 3,
    created_at: "2026-01-02T08:00:00Z",
    amount: 750.0,
    date: "2026-02-02",
    user_id: 2,
  },
  {
    id: 4,
    created_at: "2026-01-15T13:00:00Z",
    amount: 5000.0,
    date: "2026-02-15",
    user_id: 2,
  },
  {
    id: 5,
    created_at: "2026-01-20T10:45:00Z",
    amount: 2100.0,
    date: "2026-03-01",
    user_id: 2,
  },
  {
    id: 6,
    created_at: "2026-02-01T07:30:00Z",
    amount: 400.0,
    date: "2026-03-01",
    user_id: 3,
  },
  {
    id: 7,
    created_at: "2026-02-10T15:00:00Z",
    amount: 8500.0,
    date: "2026-04-10",
    user_id: 4,
  },
  {
    id: 8,
    created_at: "2026-02-12T09:20:00Z",
    amount: 1200.0,
    date: "2026-03-12",
    user_id: 4,
  },
  {
    id: 9,
    created_at: "2026-02-20T14:10:00Z",
    amount: 3000.0,
    date: "2026-04-20",
    user_id: 5,
  },
  {
    id: 10,
    created_at: "2026-03-01T11:00:00Z",
    amount: 650.0,
    date: "2026-04-01",
    user_id: 5,
  },
];
