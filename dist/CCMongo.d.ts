import { Db } from 'mongodb';
export default class CCMongo {
    private static instance;
    private uri;
    private dbName;
    private db;
    private defaultOptions;
    private options;
    constructor(uri: string, dbName: string, options: any);
    init(): Promise<Db>;
    getDb(): Promise<Db>;
    getCollection(collectionName: string): Promise<import("mongodb").Collection<import("bson").Document>>;
}
