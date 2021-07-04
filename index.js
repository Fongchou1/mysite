const express = require("express");
var path = require('path');
var ejs = require('ejs');
// var scripts = require(__dirname + '/public/js/scripts.js');

const app = express();

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );



app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");

app.get("/", function(req, res){
  // res.sendFile(__dirname + "/index.html");
  res.render("index");
});

app.get("/contact", function(req, res){
  // res.sendFile(__dirname + "/contact.html");
  res.render("contact");
});

app.get("/photography", function(req, res){
  res.render("photography");
});

app.get("/lockdown", function(req, res){
  res.render("lockdown");
});

app.get("/foreign", function(req, res){
  res.render("foreign");
});

app.get("/berlinWall", function(req, res){
  res.render("berlinWall");
});

app.get("/webProjects", function(req, res){
  res.render("designProjects")
});

// app.get("/drawings", function(req, res){
//   res.sendFile(__dirname + "/personalwebsite/public/index.html");
// });

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started at port 3000.");
});