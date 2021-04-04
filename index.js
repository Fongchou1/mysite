const express = require("express");
var path = require('path');
var ejs = require('ejs');

const app = express();

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );



app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html");
});

app.get("/contact", function(req, res){
  res.sendFile(__dirname + "/contact.html");
});

app.get("/photography", function(req, res){
  res.render("photography");
});

app.get("/lockdown", function(req, res){
  res.render("lockdown");
});

app.get("/foreigner", function(req, res){
  res.render("foreigner");
});

app.get("/berlinWall", function(req, res){
  res.render("berlinWall");
});

app.get("/webProjects", function(req, res){
  res.sendFile(__dirname + "/webProjects.html");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server started at port 3000.");
});
