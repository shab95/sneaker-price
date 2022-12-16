
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

app.post("/seller", async (request, response) => {
    /* Generating HTML */
    
    let variables = {
        searchInput: request.body.searchInput,
    }
    let productList = await stockX.stockXFlow("travis jordan 1 high");
    console.log(util.inspect(productList, {showHidden: false, depth: null, colors: true}))
    response.render("data",variables);
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

function generateBuyerTable(productJSON,store,state){
    let table = "<table border=1 style='float:right;'><caption>Flight Club Prices</caption><tr><th>Size</th><th>Price</th></tr>";
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
        } else if (store === 'fightClub'){
            x += 14.50;
        }
        return x;
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
            table += `<tr style='background-color: #D6EEEE;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
        } else if (x === expensiveSize) {
            table += `<tr style='background-color: #FFCCCB;'><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
        } else{
            table += `<tr><td>${x}</td><td>${calculateFinal(priceJSON[x])}</tr>`;
        }
    }
    table += "</table>";
    return table;
}

function getStateTaxes(state){
    if (stateTaxes.hasOwnProperty(state)){
        return stateTaxes[state]['rate'];
    }
    return 0;
}

function createElements(variables){
    variables.silhoutte = `<label>Silhoutte: ${variables.silhoutte}</label>`;
    variables.styleID = `<label>SKU: ${variables.styleID}</label>`;
    variables.colorway = `<label>Colorway:${variables.colorway}</label> `;
    variables.retailPrice = `<label>Retail Price: ${variables.retailPrice}</label>`;
    variables.thumbNail = `<img src=${variables.thumbNail} alt=${variables.shoeName} style='width:50%'>`;
    variables.releaseDate = `<label>Release Date: ${variables.releaseDate}</label>`;
    variables.description = `<label>Description: ${variables.description}</label>`;
    variables.linkX = `<a href="${variables.linkX}">StockX Link</a>`;
    variables.linkFC = `<a href="${variables.linkFC}">Flight Club Link</a>`;
    variables.linkGOAT = `<a href="${variables.linkGOAT}">GOAT Link</a>`;
    variables.shoeName = `<h2>${variables.shoeName}</h2>`;
    return variables;
}