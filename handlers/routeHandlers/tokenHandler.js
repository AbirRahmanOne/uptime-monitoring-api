/*
* Title: token Handler 
* Description: Handler to handle token related routes
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 14/02/21
*/

//dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');
const { parseJSON } = require('../../helpers/utilities') ; 
const { createRandomToken } = require('../../helpers/utilities') ;

// module scaffolding
const handler = {} ;

handler.tokenHandler = (requestProperties, callback) => {
    const httpMethods = ['get', 'post', 'put', 'delete' ] ;
    if ( httpMethods.indexOf(requestProperties.method) >= 0 ){
        handler._token[requestProperties.method](requestProperties, callback) ;

    }
    else{
        callback(405); 
    }
};

handler._token = {} ;

// handling token post request form client 
handler._token.post = (requestProperties, callback) => {


    const phone = 
        typeof requestProperties.body.phone === 'string' && 
        requestProperties.body.phone.trim().length  === 11 
            ? requestProperties.body.phone : false ;
    
    const password = 
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length  > 0
            ? requestProperties.body.password : false ;

    if(phone && password ){

        data.read('users', phone, (err, userData) => {
            const reqPassword = hash(password) ;
            if( reqPassword === parseJSON(userData).password ){
                const tokenId = createRandomToken(24) ;
                const expires  = Date.now() + (60 * 60 * 1000 ) ;
                const tokenObject = {
                    token_id : tokenId,
                    phone,
                    expires,
                }
                //store token object to db
                data.create('tokens', tokenId, tokenObject, (err2) =>{
                    if(!err2){
                        callback(200, tokenObject) ;
                    }else{
                        callback(500,{
                            error: 'Server side problem! sorry!',
                        })
                    }
                });
            }else{
                callback(400, {
                    error: "Unvalid password"
                })
            }
        });


    }else{
        callback(400, {
            error: 'Unvalid Phone number/ password!'
        })
    }
};

handler._token.get = (requestProperties, callback) => {
    
    const token_id = 
    typeof requestProperties.body.token_id === 'string' && 
    requestProperties.body.token_id.trim().length  === 24
        ? requestProperties.body.token_id : false ;

    // check if token id is valid or not
    if(token_id){
        // retrive data from db
        data.read('tokens', token_id, (err, tokenData) => {
            const data = { ...parseJSON(tokenData) } ;
            if(!err && data ){
                callback(200, data)
            }else{
                callback(404, {
                    error: 'Requested token was not found!'
                });
            }

        });
    }else{
        callback(404, {
            error: 'Requested token was not found!',
        });
    }
};

// update the token expires time 
handler._token.put = (requestProperties, callback) => {
    const token_id = 
    typeof requestProperties.body.token_id === 'string' && 
    requestProperties.body.token_id.trim().length  === 24
        ? requestProperties.body.token_id : false ;
    
    const extend  = !! (
        typeof requestProperties.body.extend === 'boolean' &&
            requestProperties.body.extend === true 
    );
    
    if(token_id && extend ){
        data.read('tokens', token_id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if(tokenObject.expires > Date.now()){
                tokenObject.expires = Date.now() + (60 * 60 *1000 ) ;

                data.update('tokens', token_id, tokenObject, (err2)=>{
                    if(!err2){
                        callback(200, tokenObject) ;
                    }else{
                        callback(500, {
                            error: 'There was a server side error'
                        });
                    }
                });
            }else{
                callback(400, {
                    error: 'Token already expired!'
                });
            }
        });

    }else{
        callback(400, {
            error: 'There was a problem in your request',
        });
    }

};

handler._token.delete = (requestProperties,callback) => {
    const token_id = 
    typeof requestProperties.body.token_id === 'string' && 
    requestProperties.body.token_id.trim().length  === 24
        ? requestProperties.body.token_id : false ;

    //check dhjhdj user Phone number is valid or not
    if(token_id){
        data.read('tokens',token_id, (err, tokenData)=>{
            if(!err && tokenData ){
                data.delete('tokens', token_id, (err2)=>{
                    if(!err2){
                        callback(200, {
                            message: 'Token Deleted Successfully!'
                        });
                    }else{
                        callback(500, {
                            error: 'There was a server side error!'
                        });
                    }
                });
            }else{
                callback(500, {
                    error: 'There was a server side error!'
                });
            }
        })

    }else{
        callback(400,{
            error: 'Invalid user!...'
        })
    }

};


handler._token.verify = (token_id, phone, callback) => {
    data.read('tokens', token_id, (err, tokenData) =>{
        if(!err && tokenData ){
            if(parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()){
                callback(true) ;
            }else{
                callback(false) ;
            }
        }else{
            callback(false) ;
        }
    })
}

module.exports = handler ;