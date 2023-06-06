/**
 * @name CCMongo.ts
 * @date 2023.06.06
 */

import {Db, MongoClient} from 'mongodb';

export default class CCMongo {
  
  private static instance: CCMongo;
  private uri!: string;
  private dbName!: string;
  private db!: Db;

  constructor(uri: string, dbName: string) {
    if (CCMongo.instance) {
      return CCMongo.instance;
    }

    this.uri = uri;
    this.dbName = dbName;
    CCMongo.instance = this;
  }

  public init() {
    return new Promise<Db>((resolve, reject) => {
      MongoClient.connect(this.uri)
        .then((client) => {
          console.log('MongoDB connected successfully!', this.uri, this.dbName);
          this.db = client.db(this.dbName);
          resolve(this.db);
        })
        .catch((err) => {
          console.error(`Error connecting to MongoDB: ${err}`);
          reject(err);
        });
    });
  }

  public async getDb() {
    if (this.db) {
      return this.db;
    }
    return await this.init();
  }

  public async getCollection(collectionName: string) {
    const db = await this.getDb();
    return await db.collection(collectionName);
  }
}
