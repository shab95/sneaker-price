const fetch = require("node-fetch");
const Request = require("request");
const mongo = require('./mongo.js');

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') })  
const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;
const databaseAndCollection = {db: process.env.MONGO_DB_NAME, collection:process.env.MONGO_COLLECTION};

async function findProducts(searchInput){
    const url = `https://sneaker-database-stockx.p.rapidapi.com/getproducts?keywords=${searchInput}&limit=10`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '839cf5908emsh19daf2da66e1c60p1b148djsn5179e869a2e2',
            'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com'
        }
    };

    const request = new fetch.Request(url, requestOptions)
    let response = await fetch(request);
    let result = await response.json();
    return result;
}

async function getProductPrices(styleID){
    const url = `https://sneaker-database-stockx.p.rapidapi.com/productprice?styleId=${styleID}`;

    const requestOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '839cf5908emsh19daf2da66e1c60p1b148djsn5179e869a2e2',
        'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com'
    }
    };

    const request = new fetch.Request(url, requestOptions)
    let response = await fetch(request);
    let result = await response.json();
    return result;
}

async function stockXFlow(searchInput){
        
    let client = await mongo.createClient(userName,password);
    let responseJSON = await findProducts(searchInput);
    let productList = responseJSON;
    if (productList.length == 0){
        return "No Products Match Your Keywords!"
    }

    let firstProduct = productList[0];
    let styleID = firstProduct.styleID;
    let inDataBase = false;

    let mongoProduct = await mongo.searchProduct(client,databaseAndCollection,styleID);
    if (mongoProduct){
        inDataBase = true;
    }
    console.log(mongoProduct);

    if (inDataBase){
            const today = new Date();
            let yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1)
        if (Date.parse(mongoProduct.lastPulled) < yesterday){
            await mongo.deleteProduct(client,databaseAndCollection,firstProduct);
            inDataBase = false;
        } else{
            return mongoProduct;
        }
    }

    if (!inDataBase){
        let productPriceJSON = await getProductPrices(styleID);
        //let productPriceJSON = {};
        console.log("products",productPriceJSON);
        flattenedJSON = {
            lowestResellX : productPriceJSON.lowestResellPrice?.stockX ?? 100,
            lowestResellFC : productPriceJSON.lowestResellPrice?.flightClub ?? 100,
            lowestResellGOAT : productPriceJSON.lowestResellPrice?.goat ?? 100 ,
            flightClubPrices : JSON.stringify(productPriceJSON.resellPrices?.flightClub) ?? "{4:0}",
            imageLinks : productPriceJSON?.imageLinks ?? "no imageLinks",
            id : productPriceJSON?._id ?? "no id",
            shoeName : productPriceJSON?.shoeName ?? "no shoe name",
            brand : productPriceJSON?.brand ?? "no brand",
            silhoutte : productPriceJSON?.silhoutte ?? "no silhoutte",
            styleID : productPriceJSON?.styleID ?? "no style id",
            make : productPriceJSON?.make ?? "no make",
            colorway : productPriceJSON?.colorway ?? "no colorway",
            retailPrice : productPriceJSON?.retailPrice ?? "no retail price",
            thumbNail : productPriceJSON?.thumbnail ?? "no picture",
            releaseDate : productPriceJSON?.releaseDate ?? "no release date",
            description : productPriceJSON?.description ?? "no description",
            urlKey :productPriceJSON?.urlKey ?? "no-key" ,
            linkX : productPriceJSON.resellLinks?.stockX ?? "https://stockx.com" ,
            linkFC : productPriceJSON.resellLinks?.flightClub ?? "https://www.flightclub.com" ,
            linkGOAT : productPriceJSON.resellLinks?.goat ?? "http://www.goat.com" ,
            goatProductId : productPriceJSON?.goatProductId ?? 0
        }
        flattenedJSON.lastPulled = Date();
        await mongo.insertProduct(client,databaseAndCollection,flattenedJSON);
    }

    return flattenedJSON;
}

exports.stockXFlow = stockXFlow;
exports.findProducts = findProducts;