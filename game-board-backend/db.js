const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://rabiyausmanghani:rabiya@cluster0.pg3si6q.mongodb.net/gameboard')
.then(()=>{console.log("Connected to database");})
.catch((e)=>{console.log(e)});

module.exports = {mongoose};