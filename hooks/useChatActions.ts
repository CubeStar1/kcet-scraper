"use client"

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

type Message = {
  id: number;
  content: string;
  user_id: string;
  channel_id: number;
  created_at: string;
  user: {
    id: string;
    username: string;
  };
};

type Channel = {
  id: number;
  name: string;
  created_at: string;
};

export default function useChatActions() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      const { data } = await supabase.from("channels").select("*");
      if (data) setChannels(data);
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    if (currentChannel) {
      const fetchMessages = async () => {
        const { data } = await supabase
          .from("messages")
          .select("*, user:users(id, username)")
          .eq("channel_id", currentChannel.id);
        if (data) setMessages(data);
      };

      fetchMessages();
    }
  }, [currentChannel]);

  const sendMessage = async (content: string) => {
    if (!currentChannel || !content.trim()) return;

    const { data, error } = await supabase.from("messages").insert({
      content,
      channel_id: currentChannel.id,
      user_id: supabase.auth.user()?.id, // assuming user is authenticated
    });

    if (error) {
      console.error("Error sending message:", error.message);
      return;
    }

    if (data) {
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  const createNewChannel = async (newChannelName: string) => {
    if (!newChannelName.trim()) return;

    const { data, error } = await supabase
      .from("channels")
      .insert({ name: newChannelName })
      .select()
      .single();

    if (error) {
      console.error("Error creating channel:", error.message);
      return;
    }

    if (data) {
      setChannels((prevChannels) => [...prevChannels, data]);
      setCurrentChannel(data);
    }
  };

  const renameChannel = async (renameChannelName: string) => {
    if (!currentChannel) return;

    const { data, error } = await supabase
      .from("channels")
      .update({ name: renameChannelName })
      .eq("id", currentChannel.id)
      .select()
      .single();

    if (error) {
      console.error("Error renaming channel:", error.message);
      return;
    }

    if (data) {
      const updatedChannels = channels.map((channel) =>
        channel.id === currentChannel.id ? data : channel
      );
      setChannels(updatedChannels);
      setCurrentChannel(data);
    }
  };

  const subscribeToChannel = (channelId: number) => {
    supabase
      .channel(`public:messages:channel_id=eq.${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();
  };

  return {
    messages,
    channels,
    currentChannel,
    messagesEndRef,
    sendMessage,
    createNewChannel,
    renameChannel,
    setCurrentChannel,
    subscribeToChannel,
  };
}
