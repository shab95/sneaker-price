
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

app.post("/data", async (request, response) => {
    /* Generating HTML */
    
    let responseJSON = await stockX.findProducts(request.body.searchInput);
    let variables = {
        searchInput: products,
    }
    productList =  
    console.log(util.inspect(products, {showHidden: false, depth: null, colors: true}))
    response.render("data",variables);
});

app.listen(portNumber);

console.log(`Web server started and running at http://localhost:${portNumber}`)

