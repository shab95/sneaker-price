const fetch = require("node-fetch");
const Request = require("request");
const mongo = require('./mongo.js');

async function findProducts(searchInput){
    let myHeaders = new fetch.Headers();
    myHeaders.append("sec-ch-ua", "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"");
    myHeaders.append("apollographql-client-name", "Iron");
    myHeaders.append("app-version", "2022.12.04.02");
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("app-platform", "Iron");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");
    myHeaders.append("content-type", "application/json");
    myHeaders.append("selected-country", "US");
    myHeaders.append("x-stockx-device-id", "web-f726359c-5227-407b-a59d-1b49d4029694");
    myHeaders.append("apollographql-client-version", "2022.12.04.02");
    myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("host", "stockx.com");
    myHeaders.append("Cookie", "IR_PI=bea2f8f5-7716-11ec-bcc2-417cda8141d0%7C1657078625126; OptanonAlertBoxClosed=2022-06-05T17:05:46.684Z; OptanonConsent=isGpcEnabled=0&datestamp=Tue+Dec+13+2022+03%3A18%3A30+GMT-0500+(Eastern+Standard+Time)&version=202211.2.0&isIABGlobal=false&hosts=&consentId=a556a10f-43f1-4332-8210-5b7fb9b3d423&interactionCount=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1%2CC0004%3A1%2CC0005%3A1%2CC0003%3A1&geolocation=US%3BMD&AwaitingReconsent=false; QuantumMetricUserID=87245fb11aa84dbbe23ae4d233fec061; __cf_bm=O7aXx7hnggjUZA4YOGswDbjWGsuE56g4K.JO84lvfro-1670959211-0-AT5Av7eB83HdYicwo0b6G1mzCHK57A0F1zmmDrED1FmRKY8TiEFOkjOuEEsiRsCtuIPLCxuUx/A7FJE2xu/Nq9E=; __lt__cid=4a82869e-51c6-4387-9c35-e186af8c38ac; __pdst=d017561b5dcf4b71862263547b68661e; __pxvid=f0ec3fe1-f259-11ec-afe9-0242ac120003; __rbtld__=1; __ssid=a61316560c7066e099db096db94ff4d; _clck=leh1ch|1|f2z|0; _dd_s=; _ga=GA1.2.1569336212.1642370006; _ga_LBTH758L60=GS1.1.1644470634.2.0.1644470634.0; _pin_unauth=dWlkPVlqY3lORGhtTlRBdE9UQTJZUzAwT1RneExUZzFNRFl0WkRGaE9EWTVaR00zTTJSag; _pxvid=bb64f663-7716-11ec-aab3-4d4651417663; _scid=e45700ee-8e3a-4b1c-a7ba-383680c19f23; _tt_enable_cookie=1; _ttp=3bdd553d-661b-424d-ae69-4091bc9a2743; _uetvid=f4945c90158a11ec95bd9d8de9a63b39; ajs_anonymous_id=9e45c214-8b1d-44b4-8a54-e78ebfe93663; forterToken=99cdf6f37ea0401a96bea88ffffbdda4_1670919510312_223_UDF9_13ck; language_code=en; lastRskxRun=1656992368027; rCookie=7iz9fk3f2lrmslf8407rukyhsp62z; rbuid=9216002243364709027; rskxRunCookie=0; stockx_device_id=web-f726359c-5227-407b-a59d-1b49d4029694; stockx_homepage=sneakers; stockx_preferred_market_activity=sales; stockx_product_visits=4; stockx_seen_ask_new_info=true; stockx_selected_region=US; tracker_device=6c8bbc52-2d2a-46dd-b380-f4341e15b237");

    var raw = JSON.stringify({
        "query": "query GetSearchResults($filtersVersion: Int, $query: String!, $page: BrowsePageInput, $sort: BrowseSortInput, $staticRanking: BrowseExperimentStaticRankingInput) {\n  browse(\n    query: $query\n    page: $page\n    sort: $sort\n    filtersVersion: $filtersVersion\n    experiments: {staticRanking: $staticRanking}\n  ) {\n    categories {\n      id\n      name\n      count\n    }\n    results {\n      edges {\n        objectId\n        node {\n          ... on Product {\n            id\n            urlKey\n            primaryTitle\n            secondaryTitle\n            media {\n              thumbUrl\n            }\n            brand\n            productCategory\n          }\n          ... on Variant {\n            id\n            product {\n              id\n              urlKey\n              primaryTitle\n              secondaryTitle\n              media {\n                thumbUrl\n              }\n              brand\n              productCategory\n            }\n          }\n        }\n      }\n      pageInfo {\n        limit\n        page\n        pageCount\n        queryId\n        queryIndex\n        total\n      }\n    }\n    sort {\n      id\n      order\n    }\n  }\n}\n",
        "variables": {
            "filtersVersion": 4,
            "query": searchInput,
            "sort": {
            "id": "featured",
            "order": "DESC"
            },
            "staticRanking": {
            "enabled": false
            },
            "page": {
            "index": 1,
            "limit": 10
            }
        },
        "operationName": "GetSearchResults"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const request = new fetch.Request(`https://stockx.com/api/p/e`, requestOptions)
    let response = await fetch(request);
    let result = await response.json();
    return result;
}

function getProductList(responseJSON){
    let edges = responseJSON["data"]["browse"]["results"]["edges"];
    let productList = [];
    for (let product of edges){
        productList.push(product.node);
    }
    for (let product of productList){
        product.thumbUrl = product.media.thumbUrl;
    }
    delete product.media;
    return productList
}

function insertProducts(productList){
    let client = mongo.createClient();
    
    mongo.insertProducts(client,productList);
}

async function stockXFlow(searchInput){
    let responseJSON = await findProducts(searchInput);
    let productList = getProductList(responseJSON);
    if (productList.length == 0){
        return "No Products Match Your Keywords!"
    }
    let product = productList[0]["node"];

}
exports.findProducts = findProducts;