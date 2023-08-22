
const express = require("express");
const cors = require("cors");
const { mongoose } = require("./db");
const bodyParser = require("body-parser");
const scoreRoute = require('./routes/Scores')


const app = express();
app.use(cors());
app.use(express.json());



app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    });
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
})

app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb'}));


app.use('/scores', scoreRoute)

app.use((req, res, next) => {
    console.log(req.url);
    next();
})


app.use((req, res) => {
    res.send("Page Not Found!");
})
app.listen(process.env.PORT || 5000, function(){
    // console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });