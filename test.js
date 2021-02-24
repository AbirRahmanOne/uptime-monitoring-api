const data = require('./lib/data') ;
const { sendTwilioSms } = require('./helpers/notifications') ;

/*
const sampleData = {
    name:'England',
    language:'English',
}
//testing the file system
//@TODO del after check!
data.delete('test', 'saudi', (error) =>{
    console.log(`Error was`, error);
})

*/

// sms checking
sendTwilioSms('01521206426', 'Hello, Twillo sms checking!', (err)=>{
    console.log(`Error: `, err);
})




