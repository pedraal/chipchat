import { z } from 'zod'

export const message = z.object({
  userId: z.string(),
  username: z.string(),
  chatRoomId: z.string(),
  content: z.string().min(1),
})
export const messageDTO = z.object({ content: message.shape.content }).strict()
export type MessageDTO = z.infer<typeof messageDTO>
