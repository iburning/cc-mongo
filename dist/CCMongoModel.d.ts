import CCMongo from './CCMongo';
export default class CCMongoModel {
    mongo: CCMongo;
    collectionName: string;
    constructor(mongo: CCMongo, collectionName: string);
    findOne(query: any, options: any): Promise<import("mongodb").WithId<import("bson").Document> | null>;
    findOneAndUpdate(filter: any, update: any, options: any): Promise<import("mongodb").ModifyResult<import("bson").Document>>;
    findOneById(id: number, options: any): Promise<import("mongodb").WithId<import("bson").Document> | null>;
    findList(query: any, page?: number, pageSize?: number, options?: any): Promise<{
        list: import("mongodb").WithId<import("bson").Document>[];
        page: number;
        total: number;
    }>;
    insertOne(data: any): Promise<import("mongodb").InsertOneResult<import("bson").Document>>;
    removeOne(query: any): Promise<import("mongodb").DeleteResult>;
    updateOne(filter: any, update: any, options: any): Promise<import("mongodb").UpdateResult<import("bson").Document>>;
    getCollection(): Promise<import("mongodb").Collection<import("bson").Document>>;
    getNextId(): Promise<number>;
}
