const mongoose = require('mongoose')
require('dotenv').config();


mongoose.connect('mongodb+srv://newuser:PYHpfSEe1mnzQ3JM@cluster0.qf85m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    dbName: process.env.DB_NAME
}).then(
    () => {
        console.log('Connected to database');
    }
).catch((err) => {
    console.log('Error connecting to database ' + err);
})