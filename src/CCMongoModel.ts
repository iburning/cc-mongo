/**
 * @name CCMongoModel.mjs
 * @date 2023.06.06
 */

import CCMongo from './CCMongo';

const NEXT_IDS = 'NextIds';

export default class CCMongoModel {
  public mongo!: CCMongo
  public collectionName!: string

  constructor(mongo: CCMongo, collectionName: string) {
    this.mongo = mongo;
    this.collectionName = collectionName;
  }

  async findOne(query: any, options: any) {
    const collection = await this.getCollection();
    return await collection.findOne(query, options);
  }

  async findOneAndUpdate(filter: any, update: any, options: any) {
    const collection = await this.getCollection();
    update.$set.updatedAt = new Date();
    return await collection.findOneAndUpdate(filter, update, options);
  }

  async findOneById(id: number, options: any) {
    const collection = await this.getCollection();
    return await collection.findOne({id}, options);
  }

  async findList(query: any, page = 0, pageSize = 0, options: any = {}) {
    const collection = await this.getCollection();
    const count = await collection.countDocuments(query);
    if (page > 0 && pageSize > 0) {
      options.skip = (page - 1) * pageSize;
      options.limit = pageSize;
    }
    const list = await collection.find(query, options).toArray();

    return {
      list,
      page: pageSize ? Math.ceil(count / pageSize) : 0,
      total: count,
    };
  }

  async insertOne(data: any) {
    const collection = await this.getCollection();
    const id = await this.getNextId();
    return await collection.insertOne({
      ...data,
      id,
      createdAt: new Date(),
    });
    // return this.assertInsertOneSuccess(result);
  }

  async removeOne(query: any) {
    const collection = await this.getCollection();
    return await collection.deleteOne(query);
  }

  async updateOne(filter: any, update: any, options: any) {
    const collection = await this.getCollection();
    if (options && options.upsert) { // 判断是否插入新数据
      update.$setOnInsert = update.$setOnInsert || {};
      update.$setOnInsert.id = await this.getNextId();
      update.$setOnInsert.createdAt = new Date();
    } else {
      update.$set.updatedAt = new Date();
    }
    return await collection.updateOne(filter, update, options);
  }


  async getCollection() {
    return await this.mongo.getCollection(this.collectionName);
  }

  /**
   * Get the next id of the collection
   */
  async getNextId() {
    const collection = await this.mongo.getCollection(NEXT_IDS);
    const res = await collection.findOneAndUpdate(
        {collectionName: this.collectionName},
        {
          $inc: {nextId: 1},
        },
        {
          returnDocument: 'after', // returns the updated document.
          upsert: true,
        },
    );
    if (res.value) {
      return res.value.nextId as number;
    }
    return 1;
  }
}
