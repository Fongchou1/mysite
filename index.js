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
var e_missionWebBase = airtable.base('apppg3kkNAKUNbBzl');

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
  let footerRootTexts = {};
  let footerLinks = {};

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

            //fetch footer root text
            footerBase('root-texts').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // footer root text fetched from airtable
              readFields(footerRootTexts, records);

              // fetch footer links
              footerBase('links').select({
                view: 'DB'
              }).all(function(err, records) {
          
                if(err) { console.error(err); return; }
                
                // footer links fetched from airtable
                readFields(footerLinks, records);
        
                // fetched all required data and send
                res.render("index",
                  {
                    rootTexts: rootTexts,
                    links: links,
                    images: images,
                    videos: videos,
                    projects: projects,
                    footerRootTexts: footerRootTexts,
                    footerLinks: footerLinks
                  }
                );
          
              })
        
            })
      
          })
    
        })
  
      })

    })

  })
  

});

app.get("/e-mission-web", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let footerRootTexts = {};
  let footerLinks = {};

  //fetch footer root text
  footerBase('root-texts').select({
    view: 'DB'
  }).all(function(err, records) {

    if(err) { console.error(err); return; }
    
    // footer root text fetched from airtable
    readFields(footerRootTexts, records);

    // fetch footer links
    footerBase('links').select({
      view: 'DB'
    }).all(function(err, records) {

      if(err) { console.error(err); return; }
      
      // footer links fetched from airtable
      readFields(footerLinks, records);

      // fetch e-mission web root texts
      e_missionWebBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // e-mission web root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch e-mission web links
        e_missionWebBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // e-mission web links fetched from airtable
          readFields(links, records);
          
          // fetch e-mission web sections
          e_missionWebBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // e-mission web sections fetched from airtable
            readFields(sections, records);
            
            // fetched all required data and send
            res.render("project",
              {
                rootTexts: rootTexts,
                links: links,
                sections: sections,
                footerRootTexts: footerRootTexts,
                footerLinks: footerLinks
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