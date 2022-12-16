const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const { MongoClient, ServerApiVersion } = require('mongodb');

async function createClient(userName,password) {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.x0izjpz.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    //await client.connect();
    return client;
}

async function searchProduct(client,databaseAndCollection,styleID){
    let filter = {styleID: styleID};
    const result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);
    if (result) {
        return result;
    }
    return false;
}

async function insertProduct(client, databaseAndCollection,product) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(product);
}

async function deleteProduct(client, databaseAndCollection, styleID){
    let filter = {styleID: styleID};
    const result = await client.db(databaseAndCollection.db)
                   .collection(databaseAndCollection.collection)
                   .deleteOne(filter);
    
     console.log(`Documents deleted ${result.deletedCount}`);
}

exports.createClient = createClient;
exports.searchProduct = searchProduct;
exports.insertProduct = insertProduct;
exports.deleteProduct = deleteProduct;