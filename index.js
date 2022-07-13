const express = require("express");
var path = require('path');
var ejs = require('ejs');
const cors = require("cors");
var Airtable = require('airtable');
const bp = require("body-parser");
// const ffetch = require("node-fetch");
// var scripts = require(__dirname + '/public/js/scripts.js');

const app = express();

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));

app.use(express.static("public"));
app.set('views', path.join(__dirname, 'views'));

app.set("view engine", "ejs");

// get airtable
var airtable = new Airtable({apiKey: 'keyUVmbar6wiZjmrx'});
var photographyBase = airtable.base('appSfjdiCQWegHcDt');
var landingPageBase = airtable.base('appKYRnm4BMdQAbEs');
var footerBase = airtable.base('appW37UpLfSwnHVtS');

function readFields( outputObject , records ){
  for( let i = 0; i < records.length; i++){
    let thisRecord = records[i];
    outputObject[thisRecord.fields.title] = thisRecord.fields;
  }
}

app.get("/", async function(req, res){
  // res.sendFile(__dirname + "/index.html");
  
  let rootTexts = {};
  let links = {};
  let images = {};
  let videos = {};
  let projects = {};

  // airtable
  await landingPageBase('root-texts').select({
    view: 'DB'
  }).all(function(err, records) {

    if(err) { console.error(err); return; }

    // root texts fetched from airtable
    readFields(rootTexts, records);
    
    // move forward to fetch another table
    landingPageBase('links').select({
      view: 'DB'
    }).all(function(err, records) {

      if(err) { console.error(err); return; }
      
      // links fetched from airtable
      readFields(links, records);

      // move forward to fetch another table
      landingPageBase('images').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // images fetched from airtable
        readFields(images, records);

        //move forward to fetch another table
        landingPageBase('videos').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // videos fetched from airtable
          readFields(videos, records);
  
          //move forward to fetch another table
          landingPageBase('projects').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // projects fetched from airtable
            readFields(projects, records);
    
            // fetched all required data and send
            res.render("index",
              {
                rootTexts: rootTexts,
                links: links,
                images: images,
                videos: videos,
                projects: projects
              }
            );
      
          })
    
        })
  
      })

    })

  })
  

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