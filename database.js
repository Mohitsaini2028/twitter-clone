const mongoose = require('mongoose');
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useFindAndModify', false);

class Database{
    
    constructor(){
        this.connect();
    }
    
    connect(){

        const DB_OPTIONS = {
            dbName: 'TwitterCloneDB',
        };

        mongoose.connect(DATABASE_URL, DB_OPTIONS)
        .then(()=>{
            console.log("Connected Successfully..");          
        })
        .catch((err)=>{
                      console.log("Database Connection Error" + err);
        })
    }
}

module.exports = new Database();  // initializing it's instance so as of now by only including the file the connection will establish

// or 

// const connectDB = async (DATABASE_URL) => {
//     try{
//         const DB_OPTIONS = {
//             dbName: 'TwitterCloneDB',
//         };
//         await mongoose.connect(DATABASE_URL, DB_OPTIONS);
//     }
//     catch (err){
//         console.log("Database Connection Error" + err);
//     }
// };


