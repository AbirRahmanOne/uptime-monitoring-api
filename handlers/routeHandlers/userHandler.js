/*
* Title: user Handler 
* Description: Handler to handle user related routes
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 14/02/21
*/

//dependencies
const { hash } = require('../../helpers/utilities');
const data = require('../../lib/data');

// module scaffolding
const handler = {} ;

handler.userHandler = (requestProperties, callback) => {
    const httpMethods = ['get', 'post', 'put', 'delete' ] ;
    if ( httpMethods.indexOf(requestProperties.method) >= 0 ){
        handler._users[requestProperties.method](requestProperties, callback) ;

    }
    else{
        callback(405); 
    }
};

handler._users = {} ;

// handling post request form client 
handler._users.post = (requestProperties, callback) => {

    const firstName = 
        typeof requestProperties.body.firstName === 'string' && 
        requestProperties.body.firstName.trim().length  > 0 
            ? requestProperties.body.firstName : false ;
    
    const lastName = 
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length  > 0
            ? requestProperties.body.lastName : false ;

    const phone = 
        typeof requestProperties.body.phone === 'string' && 
        requestProperties.body.phone.trim().length  === 11 
            ? requestProperties.body.phone : false ;
    
    const password = 
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length  > 0
            ? requestProperties.body.password : false ;

    const tosAgreement = 
        typeof requestProperties.body.tosAgreement === 'boolean' && 
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement : false ;

    if ( firstName && lastName && phone && password && tosAgreement ){
        // make sure that the user doesn't already exists
        console.log('log1');
        data.read('users', phone, (err1) => {
            console.log('log2 :-> ',firstName, phone, password);
            console.log(err1);
            if(err1){
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if(!err2){
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    }else{
                        callback(500, {
                            error: 'Could not create user!',
                        });
                    }
                });
            }else {
                callback(500, {
                    error: 'There was a problem in server side!(user already exists)',
                });
            }
        });
    }else {
        callback(400, {
            error: 'You have a problem in your request',
        });

    }
}

handler._users.get = (requestProperties, callback) => {
    callback(200) ;
}

handler._users.put = (requestProperties,callback) => {

}

handler._users.delete = (requestProperties, callback) => {

}

module.exports = handler ;