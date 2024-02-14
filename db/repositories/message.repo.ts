import type { z } from 'zod'
import { type MessageDTO, type message, messageDTO } from '../dto/message.dto'
import { type BaseModel, BaseRepository } from './base.repo'
import type { SafeUserModel } from './user.repo'

export type MessageModel = z.infer<typeof message> & BaseModel

export class MessageRepository extends BaseRepository<MessageModel> {
  constructor() {
    super('messages')
    this.collection.createIndex({ chatRoomId: 1 }, { unique: false })
  }

  async create(user: SafeUserModel, chatRoomId: string, dto: MessageDTO) {
    const candidate = messageDTO.parse(dto)
    const document = this.initDocument({ ...candidate, userId: user._id.toString(), username: user.username, chatRoomId })
    await this.collection.insertOne(document)
    return document as MessageModel
  }

  async getRecentForRoom(chatRoomId: string) {
    return await this.collection.find({ chatRoomId }, { sort: { createdAt: -1 }, limit: 10 }).toArray()
  }
}
