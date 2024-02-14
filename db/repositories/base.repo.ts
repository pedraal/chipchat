import { ObjectId } from 'mongodb'
import { DbClient } from '../client'

export interface BaseModel {
  _id: ObjectId
  id: string
  createdAt: Date
  updatedAt: Date
}

export class BaseRepository<Model extends BaseModel> {
  private collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  get collection() {
    return DbClient.db.collection<Model>(this.collectionName)
  }

  newId() {
    return new ObjectId()
  }

  initDocument(object: any) {
    const now = new Date()

    const _id = this.newId()

    return {
      _id,
      id: _id.toString(),
      createdAt: now,
      updatedAt: now,
      ...object,
    }
  }
}
