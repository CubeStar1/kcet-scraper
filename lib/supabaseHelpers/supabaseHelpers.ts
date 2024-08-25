import { createSupabaseBrowser } from "@/lib/supabase/client";
import { User, Message, Channel } from "@/types/types";

const supabase = createSupabaseBrowser();

export async function fetchChannels(): Promise<Channel[]> {
  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .order("name", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function fetchMessages(channelId: number): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function fetchUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("username", { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function createChannel(name: string): Promise<Channel> {
  const { data, error } = await supabase
    .from("channels")
    .insert({ name })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function renameChannel(id: number, name: string): Promise<Channel> {
  const { data, error } = await supabase
    .from("channels")
    .update({ name })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function sendMessage(content: string, userId: string, channelId: number): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .insert({ content, user_id: userId, channel_id: channelId });
  
  if (error) throw error;
}

export async function deleteMessage(messageId: string): Promise<void> {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId);
  
  if (error) throw error;
}

export function subscribeToChannel(channelId: number, onInsert: (payload: any) => void): () => void {
  const channel = supabase
    .channel(`public:messages:channel_id=eq.${channelId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `channel_id=eq.${channelId}` },
      onInsert
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}