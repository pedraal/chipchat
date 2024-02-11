import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { type BaseModel, BaseRepository } from './base'

export const chatRoom = z.object({
  name: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters').trim(),
  slug: z.string(),
  adminId: z.string(),
  connectedUserIds: z.array(z.string()),
  bannedUserIds: z.array(z.string()),
})
export type ChatRoom = z.infer<typeof chatRoom>

export const chatRoomDTO = z.object({ name: chatRoom.shape.name, slug: chatRoom.shape.slug }).strict()
export type ChatRoomDTO = z.infer<typeof chatRoomDTO>

export type ChatRoomModel = ChatRoom & BaseModel

export class ChatRoomRepository extends BaseRepository<ChatRoomModel> {
  constructor() {
    super('chatrooms')
    this.collection.createIndex({ name: 1 }, { unique: true })
  }

  slugify(name: string) {
    return name.replaceAll(' ', '-').toLowerCase()
  }

  async findOrCreateOne(userId: string, name: string) {
    const room = await this.collection.findOne({ slug: this.slugify(name) })
    if (room)
      return room

    return await this.create(userId, { name, slug: this.slugify(name) })
  }

  async create(adminId: string, dto: ChatRoomDTO) {
    const chatRoomDTOWithUniqueName = chatRoomDTO.extend({
      name: chatRoomDTO.shape.name.refine(async (name) => {
        const chatRoom = await this.collection.findOne({ name })
        if (chatRoom)
          return false
        return true
      }, { message: 'Name already taken' }),
    })

    const candidate = await chatRoomDTOWithUniqueName.parseAsync(dto)
    const document = this.initDocument({ ...candidate, adminId, bannedUserIds: [], connectedUserIds: [] })
    await this.collection.insertOne(document)
    return document as ChatRoomModel
  }

  async joinOneBySlug(userId: string, slug: string) {
    const chatRoom = await this.collection.findOne({ slug })
    if (!chatRoom)
      return null
    if (chatRoom.bannedUserIds.includes(userId))
      throw new Error('You have been banned from this room')

    if (!chatRoom.connectedUserIds.includes(userId)) {
      chatRoom.connectedUserIds.push(userId)
      await this.collection.updateOne({ slug }, { $push: { connectedUserIds: userId } })
    }

    return chatRoom
  }

  async leaveOne(userId: string, _id: string) {
    return await this.collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $pull: { connectedUserIds: userId } }, { returnDocument: 'after' })
  }

  async findOneAndBanUser(adminId: string, roomId: string, userId: string) {
    let chatRoom = await this.collection.findOne({ _id: new ObjectId(roomId) })
    if (!chatRoom)
      throw new Error('Room not found')
    if (chatRoom.adminId !== adminId)
      throw new Error('You are not the admin of this room')
    if (chatRoom.connectedUserIds.includes(userId))
      chatRoom = await this.collection.findOneAndUpdate({ _id: new ObjectId(roomId) }, { $pull: { connectedUserIds: userId }, $push: { bannedUserIds: userId } }, { returnDocument: 'after' })

    return chatRoom
  }
}
