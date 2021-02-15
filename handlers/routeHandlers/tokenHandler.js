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
    callback(200,{
        msg: 'Token Nai :p '
    })

};

handler._token.put = (requestProperties,callback) => {

};

handler._token.delete = (requestProperties,callback) => {

};

module.exports = handler ;