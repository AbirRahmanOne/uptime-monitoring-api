/*
* Title: Handle Request response of server
* Description: Handle Request and response
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/


// dependencies
const url = require('url') ;
const { StringDecoder } = require('string_decoder') ;
const routers = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')
const { parseJSON } = require('../helpers/utilities') ;

//module scaffoldings
const handler = {}


handler.handleReqRes = (req, res) =>{
    //request handling 
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true) ;
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '') 
    const method = req.method.toLowerCase();
    const queryStringObjects = parsedUrl.query ;
    const headersObject = req.headers ;

    // request properties object
    const requestProperties ={
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObjects,
        headersObject,
    }
    // created StringDecoder object for buffer data from req
    const decoder = new StringDecoder('utf-8') ;
    let realData = '' ;

   
    // map request router path to routes handler 
    const chosenHandler = routers[trimmedPath] ? routers[trimmedPath] : notFoundHandler ;
        


    //reading data from req.body
    req.on('data', (buffer) => {
        realData += decoder.write(buffer) ;
    })
    // end the process after buffer done
    req.on('end', () => {
        realData += decoder.end() ;
        //console.log(realData);

        requestProperties.body = parseJSON(realData) ;

        chosenHandler( requestProperties,  (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500 ;
            payload = typeof payload === 'object' ? payload : {} ;

            const payloadString = JSON.stringify(payload) ;

            // return the final response 
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode) ;
            res.end(payloadString) ;
        });

        //response handle
         //res.send('Hello-World');
    });

    //console.log(queryStringObjects);    
};



module.exports = handler ;