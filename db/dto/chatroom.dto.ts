import { z } from 'zod'

export const chatRoom = z.object({
  name: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters').trim(),
  slug: z.string(),
  adminId: z.string(),
  connectedUserIds: z.array(z.string()),
  bannedUserIds: z.array(z.string()),
})
export const chatRoomDTO = z.object({ name: chatRoom.shape.name, slug: chatRoom.shape.slug }).strict()
export type ChatRoomDTO = z.infer<typeof chatRoomDTO>
