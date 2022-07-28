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
const $ = require( "jquery" );

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
var e_missionApplicationBase = airtable.base('appY39fAPDy7WjEQM');
var tarocchiBase = airtable.base('appELnXp5icqdf1hP');
var posAppBase = airtable.base('appumdk46LYqsypYu');
var berlineatsBase = airtable.base('appOMXVGZbdHaqfVx');
var graphicsBase = airtable.base('app8jeAyfHpy7jXmX');
var photographyBase = airtable.base('appSfjdiCQWegHcDt');
var contactBase = airtable.base('appOWuesPEqLFvSF8');

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
  let images = {};
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
            
            // fetch e-mission web images
            e_missionWebBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // e-mission web images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("project",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/e-mission-application", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch e-mission application root texts
      e_missionApplicationBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // e-mission application root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch e-mission application links
        e_missionApplicationBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // e-mission application links fetched from airtable
          readFields(links, records);
          
          // fetch e-mission application sections
          e_missionApplicationBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // e-mission application sections fetched from airtable
            readFields(sections, records);
            
            // fetch e-mission application images
            e_missionApplicationBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // e-mission application images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("project",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/tarocchi", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch tarocchi root texts
      tarocchiBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // tarocchi root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch tarocchi links
        tarocchiBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // tarocchi links fetched from airtable
          readFields(links, records);
          
          // fetch tarocchi sections
          tarocchiBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // tarocchi sections fetched from airtable
            readFields(sections, records);
            
            // fetch tarocchi images
            tarocchiBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // tarocchi images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("project",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/pos-app", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch pos app root texts
      posAppBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // pos app root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch pos app links
        posAppBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // pos app links fetched from airtable
          readFields(links, records);
          
          // fetch pos app sections
          posAppBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // pos app sections fetched from airtable
            readFields(sections, records);
            
            // fetch pos app images
            posAppBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // pos app images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("project",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/berlineats", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch BerlinEats root texts
      berlineatsBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // BerlinEats root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch BerlinEats links
        berlineatsBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // BerlinEats links fetched from airtable
          readFields(links, records);
          
          // fetch BerlinEats sections
          berlineatsBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // BerlinEats sections fetched from airtable
            readFields(sections, records);
            
            // fetch BerlinEats images
            berlineatsBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // BerlinEats images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("project",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/graphics", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch graphics root texts
      graphicsBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        graphicsBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          graphicsBase('sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            graphicsBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("graphics",
                {
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/photography-lockdown", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch photographyBase root texts
      photographyBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        photographyBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          photographyBase('lockdown-sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            photographyBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("photography",
                {
                  page: req.url,
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/photography-embodiment", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch photographyBase root texts
      photographyBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        photographyBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          photographyBase('embodiment-sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            photographyBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("photography",
                {
                  page: req.url,
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/photography-the-third", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch photographyBase root texts
      photographyBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        photographyBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          photographyBase('the-third-sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            photographyBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("photography",
                {
                  page: req.url,
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/photography-berlin-wall", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch photographyBase root texts
      photographyBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        photographyBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          photographyBase('berlin-wall-sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            photographyBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("photography",
                {
                  page: req.url,
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/photography-untitled", function(req, res){

  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
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

      // fetch photographyBase root texts
      photographyBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        photographyBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          photographyBase('untitled-sections').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(sections, records);
            
            // fetch graphics images
            photographyBase('images').select({
              view: 'DB'
            }).all(function(err, records) {
        
              if(err) { console.error(err); return; }
              
              // graphics images fetched from airtable
              readFields(images, records);
              
              // fetched all required data and send
              res.render("photography",
                {
                  page: req.url,
                  rootTexts: rootTexts,
                  links: links,
                  sections: sections,
                  images: images,
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
});

app.get("/contact", function(req, res){

  let rootTexts = {};
  let links = {};
  let images = {};
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

      // fetch photographyBase root texts
      contactBase('root-texts').select({
        view: 'DB'
      }).all(function(err, records) {
  
        if(err) { console.error(err); return; }
        
        // graphics root texts fetched from airtable
        readFields(rootTexts, records);
        
        // fetch graphics links
        contactBase('links').select({
          view: 'DB'
        }).all(function(err, records) {
    
          if(err) { console.error(err); return; }
          
          // graphics links fetched from airtable
          readFields(links, records);
          
          // fetch graphics sections
          contactBase('images').select({
            view: 'DB'
          }).all(function(err, records) {
      
            if(err) { console.error(err); return; }
            
            // graphics sections fetched from airtable
            readFields(images, records);
            
            // fetched all required data and send
            res.render("contact",
            {
              rootTexts: rootTexts,
              links: links,
              images: images,
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

app.post("/post-message", function(req, res){
  const postBody = req.body;
  contactBase('message').create([
    {
      "fields": {
        "email": postBody.email,
        'name': postBody.name,
        'phone': postBody.phone,
        'message': postBody.message
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    // records.forEach(function (record) {
      // console.log(record.getId());
    // });
  });
  console.log(postBody)
  res.send(postBody)
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