export interface User {
  id: number;
  created_at: string;
  name: string;
  payment_score: number;
  password_hash: string;
  email: string;
}

export interface Utang {
  id: number;
  created_at: string;
  amount: number;
  date: string;
  user_id: number;
}
