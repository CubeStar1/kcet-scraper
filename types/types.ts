import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User extends SupabaseUser {}

export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export interface Username {
  user_id: string;
  username: string;
}