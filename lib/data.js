/*
* Title: Data Library 
* Description: Data Library functions for CRUD
*Author: Abir Rahman 
*Source: Learn with Sumit
*Data: 13/02/21
*/

// dependencies
const fs = require('fs');
const path = require('path') ;

//module scaffoldings
const lib = {} ;
//path base dir 
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

// read data from file
lib.read = (dir, filename, callback ) => {
    const path = lib.basedir+dir+'/'+filename+'.json' ;
    fs.readFile(path, 'utf8', (error, data) => {
        callback(error, data) ;
    });
};

// update existing file
lib.update = (dir, filename, data, callback) => {
    // file open for writing
    const path = lib.basedir+dir+'/'+filename+'.json' ;
    fs.open( path, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            // close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            });
                        } else {
                            callback('Error writing to file!');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            console.log(`Error updating. File may not exist`);
        }
    });
};


// deleting the file
lib.delete = (dir, filename, callback )=>{
    //unlink file
    const path = lib.basedir+dir+'/'+filename+'.json' ;
    fs.unlink(path, (err) => {
        if(!err){
            callback(false) ;
        }else{
            callback('Error deleting file!!');
        }
    });
}


module.exports = lib ;
