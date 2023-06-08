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
const NEXT_IDS = 'NextIds';
class CCMongoModel {
    constructor(mongo, collectionName) {
        this.mongo = mongo;
        this.collectionName = collectionName;
    }
    findOne(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            return yield collection.findOne(query, options);
        });
    }
    findOneAndUpdate(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            update.$set.updatedAt = new Date();
            return yield collection.findOneAndUpdate(filter, update, options);
        });
    }
    findOneById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            return yield collection.findOne({ id }, options);
        });
    }
    findList(query, page = 0, pageSize = 0, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            const count = yield collection.countDocuments(query);
            if (page > 0 && pageSize > 0) {
                options.skip = (page - 1) * pageSize;
                options.limit = pageSize;
            }
            const list = yield collection.find(query, options).toArray();
            return {
                list,
                page: pageSize ? Math.ceil(count / pageSize) : 0,
                total: count,
            };
        });
    }
    insertOne(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            const id = yield this.getNextId();
            const result = yield collection.insertOne(Object.assign(Object.assign({}, data), { id, createdAt: new Date() }), options);
            return Object.assign(Object.assign({}, result), { id });
        });
    }
    removeOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            return yield collection.deleteOne(query);
        });
    }
    updateOne(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.getCollection();
            if (options && options.upsert) {
                update.$setOnInsert = update.$setOnInsert || {};
                update.$setOnInsert.id = yield this.getNextId();
                update.$setOnInsert.createdAt = new Date();
            }
            else {
                update.$set.updatedAt = new Date();
            }
            return yield collection.updateOne(filter, update, options);
        });
    }
    getCollection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mongo.getCollection(this.collectionName);
        });
    }
    getNextId() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.mongo.getCollection(NEXT_IDS);
            const res = yield collection.findOneAndUpdate({ collectionName: this.collectionName }, {
                $inc: { nextId: 1 },
            }, {
                returnDocument: 'after',
                upsert: true,
            });
            if (res.value) {
                return res.value.nextId;
            }
            return 1;
        });
    }
}
exports.default = CCMongoModel;
