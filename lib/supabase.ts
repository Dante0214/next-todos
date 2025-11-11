import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

export type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  date: string;
  created_at: string;
};
