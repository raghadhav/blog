require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.get('/',(req,res, next) => {
res.send('the main page')
})

app.post('',() => {

})
// const PORT = process.env.PORT; 
const PORT = 3004;
app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`)
})


