/*
* Title: Uptime Monitoring API 
* Description: A RESTFul API to monitor up or down time of user links
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// dependencies
const http = require('http') ; //creating http server
const {handleReqRes} = require('./helpers/handleReqRes') ;


// app objects - module scaffoldings
const app = {} ;

// configuration
app.config = {
    port: 3000 
} ;

//create server
app.createServer = () =>{
    const server = http.createServer(app.handleReqRes) ;
    let port = app.config.port ;
    server.listen(port, ()=>{
        console.log(`Listening to port ${port}`);
    })
}

// Handle Request Response
app.handleReqRes = handleReqRes ;

// start the server
app.createServer() ;