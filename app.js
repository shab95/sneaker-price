
const stockX = require('./stockX.js');
const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const portNumber = 3000;
const util = require('util')

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

app.get("/", (request, response) => {
    /* Generating HTML */
    response.render("index");
});

app.get("/buyer.ejs", (request, response) => {
    /* Generating HTML */
    response.render("buyer");
});

app.get("/seller.ejs", (request, response) => {
    /* Generating HTML */
    response.render("seller");
});


app.post("/buyerData", async (request, response) => {
    /* Generating HTML */
    
    let variables = {
        searchInput: request.body.searchInput,
        feesOption: request.body.store,
        stateOption: request.body.state
    }
    
    let productJSON = await stockX.stockXFlow(variables.searchInput);
    if (productJSON === "No Products Match Your Keywords!"){
        response.render("buyerFail");
        return;
    }
    console.log("first productsJSON",productJSON);
    let table = generateBuyerTable(productJSON,request.body.store,request.body.state);
    variables = {
        table: table,
        shoeName: productJSON.shoeName,
        silhoutte: productJSON.silhoutte,
        styleID: productJSON.styleID,
        colorway: productJSON.colorway,
        retailPrice: productJSON.retailPrice,
        releaseDate: productJSON.releaseDate,
        description: productJSON.description,
        linkX: productJSON.linkX,
        linkFC: productJSON.linkFC,
        linkGOAT: productJSON.linkGOAT,
        thumbNail: productJSON.thumbNail
    }

    variables = createElements(variables);
    //console.log(util.inspect(productList, {showHidden: false, depth: null, colors: true}))
    response.render("buyerData",variables);
});

app.post("/sellerData", async (request, response) => {
    /* Generating HTML */
    
    let variables = {
        searchInput: request.body.searchInput,
        feesOption: request.body.store,
        stateOption: request.body.profitMargin
    }
    let productJSON = await stockX.stockXFlow(variables.searchInput);
    if (productJSON === "No Products Match Your Keywords!"){
        response.render("sellerFail");
        return;
    }
    console.log("first productsJSON",productJSON);
    let table = generateSellerTable(productJSON,request.body.store,request.body.profitMargin,productJSON.retailPrice);

    variables = {
        table: table,
        shoeName: productJSON.shoeName,
        silhoutte: productJSON.silhoutte,
        styleID: productJSON.styleID,
        colorway: productJSON.colorway,
        retailPrice: productJSON.retailPrice,
        releaseDate: productJSON.releaseDate,
        description: productJSON.description,
        linkX: productJSON.linkX,
        linkFC: productJSON.linkFC,
        linkGOAT: productJSON.linkGOAT,
        thumbNail: productJSON.thumbNail
    }

    variables = createElements(variables);
    //console.log(util.inspect(productList, {showHidden: false, depth: null, colors: true})
    response.render("sellerData",variables);
});


app.listen(portNumber);

console.log(`Web server started and running at http://localhost:${portNumber}`)

const stateTaxes = {
  "HI": {
    "rate": 0.04,
    "type": "vat"
  },
  "MA": {
    "rate": 0.0625,
    "type": "vat"
  },
  "RI": {
    "rate": 0.07,
    "type": "vat"
  },
  "CT": {
    "rate": 0.06,
    "type": "vat"
  },
  "NJ": {
    "rate": 0.07,
    "type": "vat"
  },
  "MD": {
    "rate": 0.06,
    "type": "vat"
  },
  "DC": {
    "rate": 0.06,
    "type": "vat"
  },
  "WA": {
    "rate": 0.065,
    "type": "vat"
  },
  "CA": {
    "rate": 0.0825,
    "type": "vat"
  },
  "NV": {
    "rate": 0.0685,
    "type": "vat"
  },
  "ID": {
    "rate": 0.06,
    "type": "vat"
  },
  "WY": {
    "rate": 0.04,
    "type": "vat"
  },
  "UT": {
    "rate": 0.0595,
    "type": "vat"
  },
  "AZ": {
    "rate": 0.066,
    "type": "vat"
  },
  "CO": {
    "rate": 0.029,
    "type": "vat"
  },
  "NM": {
    "rate": 0.05,
    "type": "vat"
  },
  "ND": {
    "rate": 0.05,
    "type": "vat"
  },
  "SD": {
    "rate": 0.04,
    "type": "vat"
  },
  "NE": {
    "rate": 0.055,
    "type": "vat"
  },
  "KS": {
    "rate": 0.063,
    "type": "vat"
  },
  "OK": {
    "rate": 0.045,
    "type": "vat"
  },
  "TX": {
    "rate": 0.0625,
    "type": "vat"
  },
  "MN": {
    "rate": 0.06875,
    "type": "vat"
  },
  "IA": {
    "rate": 0.06,
    "type": "vat"
  },
  "MO": {
    "rate": 0.04225,
    "type": "vat"
  },
  "AR": {
    "rate": 0.06,
    "type": "vat"
  },
  "LA": {
    "rate": 0.04,
    "type": "vat"
  },
  "WI": {
    "rate": 0.05,
    "type": "vat"
  },
  "IL": {
    "rate": 0.0625,
    "type": "vat"
  },
  "MI": {
    "rate": 0.06,
    "type": "vat"
  },
  "IN": {
    "rate": 0.07,
    "type": "vat"
  },
  "OH": {
    "rate": 0.055,
    "type": "vat"
  },
  "KY": {
    "rate": 0.06,
    "type": "vat"
  },
  "TN": {
    "rate": 0.07,
    "type": "vat"
  },
  "MS": {
    "rate": 0.07,
    "type": "vat"
  },
  "AL": {
    "rate": 0.04,
    "type": "vat"
  },
  "GA": {
    "rate": 0.04,
    "type": "vat"
  },
  "FL": {
    "rate": 0.06,
    "type": "vat"
  },
  "ME": {
    "rate": 0.05,
    "type": "vat"
  },
  "VT": {
    "rate": 0.06,
    "type": "vat"
  },
  "NY": {
    "rate": 0.04,
    "type": "vat"
  },
  "PA": {
    "rate": 0.06,
    "type": "vat"
  },
  "WV": {
    "rate": 0.06,
    "type": "vat"
  },
  "VA": {
    "rate": 0.05,
    "type": "vat"
  },
  "NC": {
    "rate": 0.0575,
    "type": "vat"
  },
  "SC": {
    "rate": 0.06,
    "type": "vat"
  }
}

function getStateTaxes(state){
    if (stateTaxes.hasOwnProperty(state)){
        return stateTaxes[state]['rate'];
    }
    return 0;
}

function generateBuyerTable(productJSON,store,state){
    let table = "<table border=1 style='text-align:center;float:right;margin-top:-8%'><caption><strong>Flight Club Prices</strong></caption><tr><th>Size</th><th>Price</th></tr>";
    console.log("productsJson",productJSON);
    let priceJSON = JSON.parse(productJSON.flightClubPrices);
    let priceKeys = Object.keys(priceJSON)
    priceKeys.map((x) => parseFloat(x));
    priceKeys.sort(function(a,b){return a-b});
    console.log(priceKeys);
    let taxRate = getStateTaxes(state);
    let calculateFinal = (x) => {        
        x += (x*taxRate);
        if (store === 'stockX'){
            x += (x * .03);
            x += 14.95;
        } else if(store === 'goat'){
            x += 14.50;
        } else if (store === 'stadiumGoods'){
            x += 13;
        } else if (store === 'flightClub'){
            x += 14.50;
        }
        return x.toFixed(2);
    }
    let cheapestSize = 4;
    let cheapestPrice = Infinity;
    let expensiveSize = 4;
    let expensivePrice = -1 * Infinity;
    for (let x in priceJSON){
        if (priceJSON[x] < cheapestPrice){
            cheapestSize = x;
            cheapestPrice = priceJSON[x];
        }
        if (priceJSON[x] > expensivePrice){
            expensiveSize = x;
            expensivePrice = priceJSON[x];
        }
    }
    for (let x of priceKeys){
        if (x === cheapestSize && x === expensiveSize){
            table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
        } else if (x === cheapestSize){
            table += `<tr style='background-color: #D6EEEE;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
        } else if (x === expensiveSize) {
            table += `<tr style='background-color: #FFCCCB;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
        } else{
            table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
        }
    }
    table += `<tr><td colspan="2">${getStoreName(store)} fees applied</td></tr></table>`;
    return table;
}

function generateSellerTable(productJSON,store,includeProfitMargin,retailPrice){
    let table = "";
    if(includeProfitMargin){
        table = "<table border=1 style='text-align:center;float:right;margin-top:-8%'><caption><strong>Flight Club Prices</strong></caption><tr><th>Size</th><th>Price</th><th>Profit margin</th></tr>";
    } else{
        table = "<table border=1 style='text-align:center;float:right;margin-top:-8%'><caption><strong>Flight Club Prices</strong></caption><tr><th>Size</th><th>Price</th></tr>";
    }
    console.log("productsJson",productJSON);
    let priceJSON = JSON.parse(productJSON.flightClubPrices);
    let priceKeys = Object.keys(priceJSON)
    priceKeys.map((x) => parseFloat(x));
    priceKeys.sort(function(a,b){return a-b});
    console.log(priceKeys);
    let calculateFinal = (x) => {
        if (store === 'stockX'){
            let processing = (x * 0.03);
            x -= (x * 0.095);
            x -= (processing + 4);
        } else if(store === 'goat'){
            x -= (x * 0.095);
            x -=5;
        } else if (store === 'stadiumGoods'){
            let processing = (x * 0.01);
            x -= (x * 0.2);
            x -= (processing + 10);
        } else if (store === 'flightClub'){
            let processing = (x * 0.029);
            x -= (x * 0.095);
            x -= (processing + 5);
        }
        return x.toFixed(2);
    }
    let cheapestSize = 4;
    let cheapestPrice = Infinity;
    let expensiveSize = 4;
    let expensivePrice = -1 * Infinity;
    for (let x in priceJSON){
        if (priceJSON[x] < cheapestPrice){
            cheapestSize = x;
            cheapestPrice = priceJSON[x];
        }
        if (priceJSON[x] > expensivePrice){
            expensiveSize = x;
            expensivePrice = priceJSON[x];
        }
    }
    if (includeProfitMargin){
        for (let x of priceKeys){
            let profitMargin = (calculateFinal(priceJSON[x]) - retailPrice).toFixed(2);
            if (x === cheapestSize && x === expensiveSize){
                table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
            } else if (x === cheapestSize){
                table += `<tr style='background-color: #FFCCCB;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td><td>${profitMargin}</td></tr>`;
            } else if (x === expensiveSize) {
                table += `<tr style='background-color: #D6EEEE;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td><td>${profitMargin}</td></tr>`;
            } else{
                table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td><td>${profitMargin}</td></tr>`;
            }
        }
    } else {
        for (let x of priceKeys){
            if (x === cheapestSize && x === expensiveSize){
                table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
            } else if (x === cheapestSize){
                table += `<tr style='background-color: #FFCCCB;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
            } else if (x === expensiveSize) {
                table += `<tr style='background-color: #D6EEEE;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
            } else{
                table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</td></tr>`;
            }
        }
    }
    
    table += `<tr><td colspan="${includeProfitMargin ? 3 : 2}">${getStoreName(store)} fees applied</td></tr></table>`;
    return table;
}

function getStoreName(store){
    if (store === "goat"){
        return "GOAT";
    } else if(store === "stockX"){
        return "StockX";
    } else if(store === "stadiumGoods"){
        return "Stadium Goods";
    } else if(store === "flightClub"){
        return "Flight Club";
    } else {
        return "No";
    }
}

function createElements(variables){
    variables.silhoutte = `<label style="float:left"><strong>Silhoutte:</strong> ${variables.silhoutte}</label>`;
    variables.styleID = `<label style="float:left"><strong>SKU:</strong> ${variables.styleID}</label>`;
    variables.colorway = `<label style="float:left;white-space: nowrap;width: 23%;overflow: hidden;text-overflow: ellipsis; display: inline-block;"><strong>Colorway:</strong> ${variables.colorway}</label> `;
    variables.retailPrice = `<label style="float:left"><strong>Retail Price:</strong> $${variables.retailPrice}</label>`;
    variables.thumbNail = `<img src=${variables.thumbNail} alt=${variables.shoeName} style='width:50%;margin-left:13%;margin-top:-5%;'>`;
    variables.releaseDate = `<label style="float:left"><strong>Release Date:</strong> ${variables.releaseDate}</label>`;
    variables.description = `<label><strong>Description:</strong> ${variables.description}</label>`;
    variables.linkX = `<a href="${variables.linkX}">StockX Link</a>`;
    variables.linkFC = `<a href="${variables.linkFC}">Flight Club Link</a>`;
    variables.linkGOAT = `<a href="${variables.linkGOAT}">GOAT Link</a>`;
    variables.shoeName = `<h2 style='text-align:center'>${variables.shoeName}</h2>`;
    return variables;
}