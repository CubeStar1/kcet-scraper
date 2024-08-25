"use client"
import { useState } from "react";

export default function useChatModals() {
  const [isNewChannelModalOpen, setIsNewChannelModalOpen] = useState(false);
  const [isRenameChannelModalOpen, setIsRenameChannelModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [renameChannelName, setRenameChannelName] = useState("");
  const [username, setUsername] = useState("");

  return {
    isNewChannelModalOpen,
    setIsNewChannelModalOpen,
    isRenameChannelModalOpen,
    setIsRenameChannelModalOpen,
    isUsernameModalOpen,
    setIsUsernameModalOpen,
    isUsersModalOpen,
    setIsUsersModalOpen,
    newChannelName,
    setNewChannelName,
    renameChannelName,
    setRenameChannelName,
    username,
    setUsername,
  };
}
