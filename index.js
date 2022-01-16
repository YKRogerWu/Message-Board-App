var HTTP_PORT = process.env.PORT || 8080;
//setup mongoDB
const mongodb = require("mongodb");
const uri = "mongodb+srv://root:root123@cluster0.yc0lz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);
let db = null;

//setup Moment.js
const moment = require("moment");

//connect to MongoDB
client.connect(async function(err){
    if(err){
        console.log("Database Connection Failed", err);
        return;
    }
    db = client.db("member-system");
    console.log("Database Connection Successful");
})

//setup Express.js 
const express = require("express");
const { redirect } = require("express/lib/response");
const app = express();

//setup EJS view engine
app.set("view engins", "ejs");
app.set("views", "./views");

var warnmsg = "";

//routing and request string
app.get("/", async function(req, res){
    const collection = db.collection("member-message");
    let result = await collection.find({});
    let data = [];
    await result.forEach(member =>{
        data.push(member);
    })
    res.render("index.ejs", {warnmsg: warnmsg, data: data});
    warnmsg = "";
})
//route to extract user's input to DB
app.get("/submit", async (req, res) =>{
    const name = req.query.name.trim();
    if(!name){
        warnmsg = "Please enter a valid name :)";
        res.redirect("/");
        return;
    }
    const email = req.query.email;
    const msg = req.query.msg.trim();
    if(!msg){
        warnmsg = "Please leave a message :)";
        res.redirect("/");
        return;
    }
    const now = new Date();
    const timestamp = moment(now).format('MMM-DD-YYYY, h:mm:ss a')

    const collection = db.collection("member-message");
    await collection.insertOne({
        name: name, email: email, msg: msg, timestamp: timestamp
    })
    res.redirect("/");
})

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);