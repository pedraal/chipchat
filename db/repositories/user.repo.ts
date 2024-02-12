import type { z } from 'zod'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { userDTO } from '../dto/user.dto'
import type { UserDTO, user } from '../dto/user.dto'
import { type BaseModel, BaseRepository } from './base.repo'

export type UserModel = z.infer<typeof user> & BaseModel
export type SafeUserModel = Omit<UserModel, 'password'>
export class UserRepository extends BaseRepository<UserModel> {
  constructor() {
    super('users')
    this.collection.createIndex({ username: 1 }, { unique: true })
  }

  async create(dto: UserDTO) {
    dto.username = dto.username.replaceAll(' ', '_')

    const userDTOWithUniqueUsername = userDTO.extend({
      username: userDTO.shape.username.refine(async (username) => {
        const user = await this.collection.findOne({ username })
        if (user)
          return false
        return true
      }, { message: 'Username already taken' }),
    })

    const candidate = await userDTOWithUniqueUsername.parseAsync(dto)
    const salt = bcrypt.genSaltSync(10)
    candidate.password = bcrypt.hashSync(candidate.password, salt)
    const document = this.initDocument({ ...candidate })
    await this.collection.insertOne(document)
    return document as UserModel
  }

  async authenticate(dto: UserDTO) {
    const user = await this.collection.findOne({ username: dto.username })
    if (!user || !bcrypt.compareSync(dto.password, user.password))
      throw new Error('Invalid username or password')

    return user
  }

  async findMany(ids: string[]): Promise<SafeUserModel[]> {
    return await this.collection.find({ _id: { $in: ids.map(id => new ObjectId(id)) } }, { projection: { password: 0 } }).toArray()
  }
}
