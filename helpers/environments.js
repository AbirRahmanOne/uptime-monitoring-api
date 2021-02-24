/*
* Title: Environments
* Description: Handle all environment related things
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// dependencies

// module scaffolding
const environments  ={} ;

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'jdhjhsah3327673bwdbhdb',
    maxChecksLimit : 10 ,
    twilio: {
        fromPhone: '+12029029276',
        accountSid: 'AC35e7be45d99c71d7cdf5ad7cfdf415f1',
        authToken: 'c2922e3ae8385355c214b0ecc4b21ccf',
    },

}

// production enviroment
environments.production = {
    port: 8000,
    envName: 'production',
    secretKey: 'jhsjihar72y73bhdgdygsgdhd',
    maxChecksLimit : 10 ,
    twilio: {
        fromPhone: '+12029029276',
        accountSid: 'AC35e7be45d99c71d7cdf5ad7cfdf415f1',
        authToken: 'c2922e3ae8385355c214b0ecc4b21ccf',
    },


}


// determine which enviroment was passed
const currentEnvironment  = 
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging' ;

// export corresponding enviroment object
const environmentToExport  = 
    typeof environments[currentEnvironment ] === 'object'
    ? environments[currentEnvironment ] 
    : environments.staging ;

//export module
module.exports = environmentToExport  ;