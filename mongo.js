const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection:process.env.MONGO_COLLECTION};
const { MongoClient, ServerApiVersion } = require('mongodb');

function createClient() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.x0izjpz.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    return client;
}

async function insertProducts(client, productList) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertMany(productList);
    await client.close();
}