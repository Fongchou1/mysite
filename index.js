const express = require("express");

const app = express();

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


app.use(express.static("public") );

app.get("/", function(req, res){

  res.sendFile(__dirname + "/index.html");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server started at port 3000.");
});
