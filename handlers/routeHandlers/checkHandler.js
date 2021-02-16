/*
* Title: check Handler 
* Description: Handler to handle user check related routes
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 16/02/21
*/

//dependencies
const { createRandomToken } = require('../../helpers/utilities');
const data = require('../../lib/data');
const { parseJSON } = require('../../helpers/utilities') ; 
const  tokenHandler  = require('./tokenHandler');
const { maxChecksLimit } = require('../../helpers/environments');

// module scaffolding
const handler = {} ;

handler.checkHandler = (requestProperties, callback) => {
    const httpMethods = ['get', 'post', 'put', 'delete' ] ;
    if ( httpMethods.indexOf(requestProperties.method) >= 0 ){
        handler._check[requestProperties.method](requestProperties, callback) ;

    }
    else{
        callback(405); 
    }
};

handler._check = {} ;

// handling post request form client 
handler._check.post = (requestProperties, callback) => {
    //validate inputs
    const protocol = 
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 
        ? requestProperties.body.protocol : false ;

    const url = 
        typeof requestProperties.body.url === 'string' && 
        requestProperties.body.url.trim().length > 0 ?
        requestProperties.body.url : false ;
    
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCodes = 
        typeof requestProperties.body.successCodes === 'object' && 
        requestProperties.body.successCodes instanceof Array ?
        requestProperties.body.successCodes : false ;
    
     const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    //logic

    console.log(protocol, url , method, successCodes, timeoutSeconds);

    
    if(protocol && url && method && successCodes && timeoutSeconds ){
    
        console.log(protocol, url , method, successCodes, timeoutSeconds);
        //token validation check 
        const token = 
            typeof requestProperties.headersObject.token === 'string' ?
            requestProperties.headersObject.token : false ;

        // lookup the user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if(!err && tokenData ){
                // find user phone number for checking
                const userPhone  = parseJSON(tokenData).phone ;
                //lookup the user data
                data.read('users', userPhone, (err2, userData) =>{
                    if(!err2 && userData ){
                        // verify the token 
                        tokenHandler._token.verify(token, userPhone, (isValidToken) =>{
                            if(isValidToken){
                                const userObject = parseJSON(userData) ;
                                const userChecks = 
                                    typeof userObject.checks === 'object' && 
                                    userObject.checks instanceof Array ?
                                    userObject.checks : [] ;

                                    // checking limit 
                                    if(userChecks.length < maxChecksLimit){
                                        const checkId = createRandomToken(20) ;
                                        const checkObject = {
                                            checkId,
                                            userPhone,
                                            protocol,
                                            url,
                                            method,
                                            successCodes,
                                            timeoutSeconds,
                                        };
                                        //save the objects 
                                        data.create('checks', checkId, checkObject, (err3)=>{
                                            if(!err3) {
                                                // add check id to the user's object
                                                userObject.checks = userChecks ;
                                                userObject.checks.push(checkId) ;

                                                //save the new user data
                                                data.update('users', userPhone, userObject, (err4)=>{
                                                    if(!err4){
                                                        callback(200, checkObject) ;
                                                    }else{
                                                        callback(500, {
                                                            error: 'There was a problem in server side!'
                                                        })
                                                    }
                                                })
                                            }else{
                                                callback(500, {
                                                    error: 'There was a problem in server side!!'
                                                })
                                            }
                                        })


                                    }else{
                                        callback(401, {
                                            error: 'User has already reached max check limit!',
                                        })
                                    }


                            }else{
                                callback(403, {
                                    error : 'Authentication Failed, Invalid TOken!'
                                })
                            }
                        })

                    }else{
                        callback(403, {
                            error: 'User not found!'
                        })
                    }
                })

            }else{
                callback(403, {
                    error : 'Authentications Failed!'
                })
            }
        })

    }else{
        callback(400, {
            error: 'You have a problem in your request',
        });
    }


}

handler._check.get = (requestProperties, callback) => {

    const id = 
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20 ?
            requestProperties.body.id : false ;

    if(id){
        //lookup for data
        data.read('checks', id, (err, checkData) => {
            if(!err && checkData ){
                
                // token validation
                const token = 
                    typeof requestProperties.headersObject.token === 'string' ?
                        requestProperties.headersObject.token : false ;

                const phone = parseJSON(checkData).userPhone ;
                const data = parseJSON(checkData) ;
                tokenHandler._token.verify(token, phone, (isValidToken) => {
                    console.log(isValidToken);
                    if(isValidToken){
                        callback(200, data)

                    }else{
                        callback(403, {
                            error: 'Auth errors' 
                        })
                    }

                })
            }else{
                callback(400, {
                    error: 'Server Side Problem!, Maybe Data can not retrived' 
                })
            }
        })


    }else{
        callback(400, {
            error: 'Server Side Problem!' 
        })
    }
};

// update check operations
handler._check.put = (requestProperties,callback) => {

    const id = 
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20 ?
            requestProperties.body.id : false ;

     // validate inputs
     const protocol =
     typeof requestProperties.body.protocol === 'string' &&
     ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
         ? requestProperties.body.protocol
         : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;
        
    if(id){
        if(protocol || url || method || successCodes || timeoutSeconds ){
            data.read('checks', id, (err, checkData)=> {
                if(!err && checkData ){
                    const token = 
                    typeof requestProperties.headersObject.token === 'string' ?
                        requestProperties.headersObject.token : false ;

                    const phone = parseJSON(checkData).userPhone ;
                    const checkObject = parseJSON(checkData);
                    tokenHandler._token.verify(token, phone, (isValidToken) =>{
                        if(isValidToken){
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCodes) {
                                checkObject.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }
                            console.log('Here!');
                            console.log(checkObject);
                            // store the data into checks file
                            data.update('checks', id, checkObject, (err2)=>{
                                console.log('Error update', err2);
                                if(!err2){
                                    callback(200) ;
                                }else{
                                    callback(500, {
                                        error: 'There was a server side problem...!'
                                    })
                                }
                            })

                        }else{
                            callback(403, {
                                error: 'Authentication error!',
                            });
                        }

                    });

                }else{
                    callback(500, {
                        error: 'There was a problem in the server side!',
                    });
                }
            });
        }else{
            callback(400, {
                error: 'You must provide at least one field to update!',
            });
        }

    }else{
        callback(400, {
            error: 'You have a problem in your request',
        }); 
    }


}

handler._check.delete = (requestProperties, callback) => {



}

module.exports = handler ;