/*
* Title: Not Found Handler 
* Description: url not found 404 errors Handler
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// module scaffolding
const handler = {} ;

handler.notFoundHandler = (requestProperties, callback) => {

    callback( 404, {
        message: 'Your requested URL was not found!',
    });
};

module.exports = handler ;