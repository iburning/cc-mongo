# cc-mongo

A simple way to use MongoDB.js

## Installation

```bash
npm i cc-mongo
```

## Usage

```javascript
import { CCMongo, CCMongoModel } from 'cc-mongo'

const MONGO_URI = 'mongodb://127.0.0.1:27017'
const MONGO_DB_NAME = 'coocoa_dev'

const mongo = new CCMongo(MONGO_URI, MONGO_DB_NAME)
const postModel = new CCMongoModel(mongo, 'Posts')

try {
  const result = await postModel.createOne({
    title: 'This is my first post',
    content: '...'
  })
  console.log(result)
} catch (err) {
  console.warn(err)
}
```
