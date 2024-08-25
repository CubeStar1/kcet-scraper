import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User extends SupabaseUser {
  username?: string; // Optional because it comes from a LEFT JOIN
  user_role: 'user' | 'moderator' | 'admin';
}

// ... other interfaces remain the same

export interface Message {
  id: string;
  content: string;
  user_id: string;
  channel_id: number;
  created_at: string;
}

export interface Channel {
  id: number;
  name: string;
}