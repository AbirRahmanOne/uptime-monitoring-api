const data = require('./lib/data') ;


const sampleData = {
    name:'India',
    language:'Hindi',
}
//testing the file system
//@TODO del after check!
data.create('test', 'newFile3', sampleData, (error) =>{
    console.log(`Error was`, error);
})
