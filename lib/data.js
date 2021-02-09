/*
* Title: Data Library 
* Description: Data Library functions for CRUD
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 08/02/21
*/

// dependencies
const fs = require('fs');
const path = require('path') ;

//module scaffoldings
const lib = {} ;

lib.basedir = path.join( __dirname, '../.data/');

//write data to file
lib.create = (dir, filename, data, callback ) => {
    // open file for writing
    const path = lib.basedir+dir+'/'+filename+'.json' ;
    fs.open(path, 'wx', (error, fileDescriptor) =>{
        if(!error && fileDescriptor ){
            //convert data to string
            const stringData =  JSON.stringify(data) ;

            //write data to file and then close it
            fs.writeFile( fileDescriptor, stringData, (err)=>{
                if (!err){
                    fs.close(fileDescriptor, (err2)=>{
                        if(!err2){
                            callback(false) ;
                        }else{
                            callback('Error closing the new file')
                        }
                    })
                }else{
                    callback(`Error  writing to new file`) ;
                }
            });
        }else{
            callback(error) ;
        }
    });
}


module.exports = lib ;