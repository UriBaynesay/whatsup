"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import {
  addMemberToGroupChat,
  createChat,
  createGroupChat,
  getUserChats,
  isUserAdmin,
} from "./db"
import { getProfileByEmail } from "../profile/db"

export const getUserChatsAction = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) redirect("/sign-in")
  return await getUserChats(data.user.id)
}

export const createChatAction = async (formData: FormData) => {
  const supabase = createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) redirect("/sign-in")
  const email = formData.get("email")?.toString()
  const partnerProfile = await getProfileByEmail(email)
  if (!partnerProfile) return
  const chat = await createChat(userData.user.id, partnerProfile.id)
  if (chat) redirect(`/chats/${chat.id}`)
  return null
}

export const createGroupChatAction = async (formData: FormData) => {
  const supabase = createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) redirect("/sign-in")
  const title = formData.get("title") as string
  const partnerEmail = formData.get("email") as string
  const chat = await createGroupChat(userData.user.id, title, partnerEmail)
  if (chat) redirect("/")
}

export const addMemberToGroupChatAction = async (formData: FormData) => {
  const supabase = createClient()
  const chatId = formData.get("id") as string
  const email = formData.get("email") as string
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (!user || userError) redirect("/sign-in")
  const isAdmin = await isUserAdmin(chatId, user.id)
  if (!isAdmin) redirect("/chats/group-chat/create")
  const member = await getProfileByEmail(email)
  if (!member) redirect("/chats/group-chat/create")
  const { error: addMemberError } = await addMemberToGroupChat(
    chatId,
    member.id
  )
  if (addMemberError) redirect("/chats/group=chat/create")
  redirect(`/chats/${chatId}`)
}
