import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { type BaseModel, BaseRepository } from './base'

export const user = z.object({
  username: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters').trim(),
  password: z.string().min(3, 'Must be longer than 3 characters').max(20, 'Must be shorter than 20 characters'),
})
export type User = z.infer<typeof user>

export const userDTO = z.object({ username: user.shape.username, password: user.shape.password }).strict()
export type UserDTO = z.infer<typeof userDTO>

export type UserModel = User & BaseModel
export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super('chatrooms')
    this.collection.createIndex({ username: 1 })
  }

  async create(dto: UserDTO) {
    const candidate = userDTO.parse(dto)
    candidate.username = candidate.username.replaceAll(' ', '_')
    const salt = bcrypt.genSaltSync(10)
    candidate.password = bcrypt.hashSync(candidate.password, salt)
    const document = this.initDocument({ ...candidate })
    await this.collection.insertOne(document)
    return document
  }
}
