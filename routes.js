/*
* Title: Routes
* Description: Applications ROutes 
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// dependencies 
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler') ;
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler') ;
const { checkHandler } = require('./handlers/routeHandlers/checkHandler') ;

const routes = {
    sample : sampleHandler,
    user : userHandler,
    token : tokenHandler,
    check : checkHandler,
}

module.exports = routes ;