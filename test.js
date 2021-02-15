const data = require('./lib/data') ;


const sampleData = {
    name:'England',
    language:'English',
}
//testing the file system
//@TODO del after check!
data.delete('test', 'saudi', (error) =>{
    console.log(`Error was`, error);
})



