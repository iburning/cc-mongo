"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
class CCMongo {
    constructor(uri, dbName, options) {
        this.defaultOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };
        if (CCMongo.instance) {
            return CCMongo.instance;
        }
        this.uri = uri;
        this.dbName = dbName;
        this.options = options;
        CCMongo.instance = this;
    }
    init() {
        return new Promise((resolve, reject) => {
            mongodb_1.MongoClient.connect(this.uri, Object.assign(Object.assign({}, this.defaultOptions), this.options)).then((client) => {
                console.log('MongoDB connected successfully!', this.uri, this.dbName);
                this.db = client.db(this.dbName);
                resolve(this.db);
            }).catch((err) => {
                console.error(`Error connecting to MongoDB: ${err}`);
                reject(err);
            });
        });
    }
    getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                return this.db;
            }
            return yield this.init();
        });
    }
    getCollection(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getDb();
            return yield db.collection(collectionName);
        });
    }
}
exports.default = CCMongo;
