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
  private defaultOptions = {
    // 于启用新的URL解析器
    useNewUrlParser: true, 
    // 启用MongoDB 4.0及更高版本中引入的统一拓扑（Unified Topology）功能
    // 启用统一拓扑功能可以提高代码的可维护性和可扩展性
    // 因为它允许您使用相同的代码来访问不同类型的MongoDB实例
    useUnifiedTopology: true
  };
  private options: any

  constructor(uri: string, dbName: string, options: any) {
    if (CCMongo.instance) {
      return CCMongo.instance;
    }

    this.uri = uri;
    this.dbName = dbName;
    this.options = options;
    CCMongo.instance = this;
  }

  public init() {
    return new Promise<Db>((resolve, reject) => {
      MongoClient.connect(this.uri, {
        ...this.defaultOptions,
        ...this.options
      }).then((client) => {
        console.log('MongoDB connected successfully!', this.uri, this.dbName);
        this.db = client.db(this.dbName);
        resolve(this.db);
      }).catch((err) => {
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
