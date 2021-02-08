/*
* Title: Sample Handler 
* Description: Sample Handler
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// module scaffolding
const handler = {} ;

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback( 200, {
        message: 'This is a sample url',
    });
};

module.exports = handler ;