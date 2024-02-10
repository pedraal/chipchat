import { z } from 'zod'
import { type BaseModel, BaseRepository } from './base'
import type { UserModel } from './user'

export const message = z.object({
  userId: z.string(),
  username: z.string(),
  chatRoomId: z.string(),
  content: z.string().min(1),
})
export type Message = z.infer<typeof message>

export const messageDTO = z.object({ content: message.shape.content }).strict()
export type MessageDTO = z.infer<typeof messageDTO>

export type MessageModel = Message & BaseModel

export class MessageRepository extends BaseRepository<MessageModel> {
  constructor() {
    super('messages')
    this.collection.createIndex({ chatRoomId: 1 }, { unique: false })
  }

  async create(user: UserModel, chatRoomId: string, dto: MessageDTO) {
    const candidate = messageDTO.parse(dto)
    const document = this.initDocument({ ...candidate, userId: user._id.toString(), username: user.username, chatRoomId })
    await this.collection.insertOne(document)
    return document as MessageModel
  }

  async getRecentForRoom(chatRoomId: string) {
    return await this.collection.find({ chatRoomId }, { sort: { createdAt: -1 }, limit: 10 }).toArray()
  }
}
