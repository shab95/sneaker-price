//*****TWITTER API NOT IMPLEMENTED YET******/
// const needle = require('needle');
// const path = require("path");
// const bodyParser = require("body-parser");
// require("dotenv").config({ path: path.resolve(__dirname, '.env') })

// const token = process.env.BEARER_TOKEN;
// const endpointUrl = "https://api.twitter.com/2/tweets/counts/recent";

// async function getRequest() {

//     // Edit query parameters below and specify a search query
//     // optional params: start_time,end_time,since_id,until_id,next_token,granularity
//     const params = {
//         'query': 'panda dunks',
//         'granularity': 'day'
//     }

//     const res = await needle('get', endpointUrl, params, {
//         headers: {
//             "User-Agent": "v2RecentTweetCountsJS",
//             "authorization": `Bearer ${token}`
//         }
//     })

//     if (res.body) {
//         return res.body;
//     } else {
//         throw new Error('Unsuccessful request');
//     }
// }

// (async () => {

//     try {
//         // Make request
//         const response = await getRequest();
//         console.dir(response, {
//             depth: null
//         });

//     } catch (e) {
//         console.log(e);
//         process.exit(-1);
//     }
//     process.exit();
// })();