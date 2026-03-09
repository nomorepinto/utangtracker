import { User, Utang } from "./types";



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
