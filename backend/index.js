const express = require('express');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI).then(()=> console.log('MongoDB connected')).catch((err) => {
    console.log('Connection error: ', err)
})


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


app.post('/api/google-login', async(req , res) => {
    const {token} = req.body // extract token from req body


    // verify token with google oauth2 server

    const ticket = await  client.verifyIdToken(
        {
            idToken: token, 
            audience: process.env.GOOGLE_CLIENT_ID
        }
    )


    // retreive user detail from the token

    const payload = ticket.getPayload()

    res.status(200).json({user: payload})
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the port number on which server is running
});