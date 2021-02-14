/*
* Title: Utilities
* Description:  Important utility functions
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 14/02/21
*/

// dependencies
const crypto = require('crypto') ;
const environments = require('./environments');

// module scaffolding
const utilities  ={} ;

utilities.parseJSON = (jsonString) => {
    let output ;
    try {
        output = JSON.parse(jsonString) ;
    } catch {
        output = {} ;
    }
    return output ;
}

utilities.hash = (password) => {
    if(typeof password === 'string' && password.length > 0 ){
        console.log(environments, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256',environments.secretKey)
                            .update(password)
                            .digest('hex');
        return hash ; 
    }else{
        return false ;
    }
}

//export module
module.exports = utilities;