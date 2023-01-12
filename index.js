const express = require("express");
var path = require("path");
var ejs = require("ejs");
const cors = require("cors");
var Airtable = require("airtable");
const bp = require("body-parser");
// const ffetch = require("node-fetch");
// var scripts = require(__dirname + '/public/js/scripts.js');

const app = express();

const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery");

app.use(cors());
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use(require("morgan")("dev"));

app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

// get airtable
var airtable = new Airtable({ apiKey: "keyUVmbar6wiZjmrx" });
var photographyBase = airtable.base("appSfjdiCQWegHcDt");
var landingPageBase = airtable.base("appKYRnm4BMdQAbEs");
var footerBase = airtable.base("appW37UpLfSwnHVtS");
var photographyBase = airtable.base("appSfjdiCQWegHcDt");
var contactBase = airtable.base("appOWuesPEqLFvSF8");
var sectionsBase = airtable.base("appRuYKIRNhEu7TZi");

function readFields(outputObject, records) {
    for (let i = 0; i < records.length; i++) {
        let thisRecord = records[i];
        outputObject[thisRecord.fields.title] = thisRecord.fields;
    }
}

app.get("/", async function (req, res) {
    // res.sendFile(__dirname + "/index.html");

    let rootTexts = {};
    let links = {};
    let images = {};
    let sections = {};
    let projects = {};
    let cards = {};
    let footerRootTexts = {};
    let footerLinks = {};

    // airtable
    await sectionsBase("root-texts")
        .select({
            view: "Landing Page",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // root texts fetched from airtable
            readFields(rootTexts, records);

            // move forward to fetch another table
            sectionsBase("links")
                .select({
                    view: "Landing Page",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // links fetched from airtable
                    readFields(links, records);

                    // move forward to fetch another table
                    sectionsBase("images")
                        .select({
                            view: "Landing Page",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // images fetched from airtable
                            readFields(images, records);

                            //move forward to fetch another table
                            sectionsBase("sections")
                                .select({
                                    view: "Landing Page",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // sections fetched from airtable
                                    readFields(sections, records);

                                    //move forward to fetch another table
                                    sectionsBase("projects")
                                        .select({
                                            view: "Landing Page",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // projects fetched from airtable
                                            readFields(projects, records);

                                            sectionsBase("cards")
                                                .select({
                                                    view: "Landing Page",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // cards fetched from airtable
                                                    readFields(cards, records);

                                                    //fetch footer root text
                                                    footerBase("root-texts")
                                                        .select({
                                                            view: "DB",
                                                        })
                                                        .all(function (
                                                            err,
                                                            records
                                                        ) {
                                                            if (err) {
                                                                console.error(
                                                                    err
                                                                );
                                                                return;
                                                            }

                                                            // footer root text fetched from airtable
                                                            readFields(
                                                                footerRootTexts,
                                                                records
                                                            );

                                                            // fetch footer links
                                                            footerBase("links")
                                                                .select({
                                                                    view: "DB",
                                                                })
                                                                .all(function (
                                                                    err,
                                                                    records
                                                                ) {
                                                                    if (err) {
                                                                        console.error(
                                                                            err
                                                                        );
                                                                        return;
                                                                    }

                                                                    // footer links fetched from airtable
                                                                    readFields(
                                                                        footerLinks,
                                                                        records
                                                                    );

                                                                    // fetched all required data and send
                                                                    res.render(
                                                                        "index",
                                                                        {
                                                                            rootTexts:
                                                                                rootTexts,
                                                                            links: links,
                                                                            images: images,
                                                                            sections:
                                                                                sections,
                                                                            projects:
                                                                                projects,
                                                                            cards: cards,
                                                                            footerRootTexts:
                                                                                footerRootTexts,
                                                                            footerLinks:
                                                                                footerLinks,
                                                                        }
                                                                    );
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/e-mission-web", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch e-mission web root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "e-Mission Web",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // e-mission web root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch e-mission web links
                            sectionsBase("links")
                                .select({
                                    view: "e-Mission Web",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // e-mission web links fetched from airtable
                                    readFields(links, records);

                                    // fetch e-mission web sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "e-Mission Web",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // e-mission web sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch e-mission web images
                                            sectionsBase("images")
                                                .select({
                                                    view: "e-Mission Web",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // e-mission web images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/e-mission-application", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch e-mission application root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "e-Mission App",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // e-mission application root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch e-mission application links
                            sectionsBase("links")
                                .select({
                                    view: "e-Mission App",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // e-mission application links fetched from airtable
                                    readFields(links, records);

                                    // fetch e-mission application sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "e-Mission App",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // e-mission application sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch e-mission application images
                                            sectionsBase("images")
                                                .select({
                                                    view: "e-Mission App",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // e-mission application images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/tarocchi", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch tarocchi root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "Tarocchi",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // tarocchi root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch tarocchi links
                            sectionsBase("links")
                                .select({
                                    view: "Tarocchi",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // tarocchi links fetched from airtable
                                    readFields(links, records);

                                    // fetch tarocchi sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "Tarocchi",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // tarocchi sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch tarocchi images
                                            sectionsBase("images")
                                                .select({
                                                    view: "Tarocchi",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // tarocchi images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/pos-app", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch pos app root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "POS App",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // pos app root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch pos app links
                            sectionsBase("links")
                                .select({
                                    view: "POS App",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // pos app links fetched from airtable
                                    readFields(links, records);

                                    // fetch pos app sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "POS App",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // pos app sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch pos app images
                                            sectionsBase("images")
                                                .select({
                                                    view: "POS App",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // pos app images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/berlineats", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch BerlinEats root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "BerlinEats",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // BerlinEats root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch BerlinEats links
                            sectionsBase("links")
                                .select({
                                    view: "BerlinEats",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // BerlinEats links fetched from airtable
                                    readFields(links, records);

                                    // fetch BerlinEats sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "BerlinEats",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // BerlinEats sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch BerlinEats images
                                            sectionsBase("images")
                                                .select({
                                                    view: "BerlinEats",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // BerlinEats images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/video-management-app", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch BerlinEats root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "Video Management App",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // BerlinEats root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch BerlinEats links
                            sectionsBase("links")
                                .select({
                                    view: "Video Management App",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // BerlinEats links fetched from airtable
                                    readFields(links, records);

                                    // fetch BerlinEats sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "Video Management App",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // BerlinEats sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch BerlinEats images
                                            sectionsBase("images")
                                                .select({
                                                    view: "Video Management App",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // BerlinEats images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("project", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/kickstart", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let cards = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch e-mission web root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "Kickstart",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // e-mission web root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch e-mission web links
                            sectionsBase("links")
                                .select({
                                    view: "Kickstart",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // e-mission web links fetched from airtable
                                    readFields(links, records);

                                    // fetch e-mission web sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "Kickstart",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // e-mission web sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch e-mission web images
                                            sectionsBase("images")
                                                .select({
                                                    view: "Kickstart",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // e-mission web images fetched from airtable
                                                    readFields(images, records);

                                                    //fetch kickstart cards
                                                    sectionsBase("cards")
                                                        .select({
                                                            view: "Kickstart",
                                                        })
                                                        .all(function (
                                                            err,
                                                            records
                                                        ) {
                                                            if (err) {
                                                                console.error(
                                                                    err
                                                                );
                                                                return;
                                                            }

                                                            // e-mission web images fetched from airtable
                                                            readFields(
                                                                cards,
                                                                records
                                                            );

                                                            // fetched all required data and send
                                                            res.render(
                                                                "project",
                                                                {
                                                                    rootTexts:
                                                                        rootTexts,
                                                                    links: links,
                                                                    sections:
                                                                        sections,
                                                                    images: images,
                                                                    footerRootTexts:
                                                                        footerRootTexts,
                                                                    footerLinks:
                                                                        footerLinks,
                                                                    cards:
                                                                        cards,
                                                                }
                                                            );
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/take-off-day", function (req, res) {
  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
  let cards = {};
  let footerRootTexts = {};
  let footerLinks = {};

  //fetch footer root text
  footerBase("root-texts")
      .select({
          view: "DB",
      })
      .all(function (err, records) {
          if (err) {
              console.error(err);
              return;
          }

          // footer root text fetched from airtable
          readFields(footerRootTexts, records);

          // fetch footer links
          footerBase("links")
              .select({
                  view: "DB",
              })
              .all(function (err, records) {
                  if (err) {
                      console.error(err);
                      return;
                  }

                  // footer links fetched from airtable
                  readFields(footerLinks, records);

                  // fetch e-mission web root texts
                  sectionsBase("root-texts")
                      .select({
                          view: "Take Off Day",
                      })
                      .all(function (err, records) {
                          if (err) {
                              console.error(err);
                              return;
                          }

                          // e-mission web root texts fetched from airtable
                          readFields(rootTexts, records);

                          // fetch e-mission web links
                          sectionsBase("links")
                              .select({
                                  view: "Take Off Day",
                              })
                              .all(function (err, records) {
                                  if (err) {
                                      console.error(err);
                                      return;
                                  }

                                  // e-mission web links fetched from airtable
                                  readFields(links, records);

                                  // fetch e-mission web sections
                                  sectionsBase("sections")
                                      .select({
                                          view: "Take Off Day",
                                      })
                                      .all(function (err, records) {
                                          if (err) {
                                              console.error(err);
                                              return;
                                          }

                                          // e-mission web sections fetched from airtable
                                          readFields(sections, records);

                                          // fetch e-mission web images
                                          sectionsBase("images")
                                              .select({
                                                  view: "Take Off Day",
                                              })
                                              .all(function (err, records) {
                                                  if (err) {
                                                      console.error(err);
                                                      return;
                                                  }

                                                  // e-mission web images fetched from airtable
                                                  readFields(images, records);

                                                  //fetch kickstart cards
                                                  sectionsBase("cards")
                                                      .select({
                                                          view: "Take Off Day",
                                                      })
                                                      .all(function (
                                                          err,
                                                          records
                                                      ) {
                                                          if (err) {
                                                              console.error(
                                                                  err
                                                              );
                                                              return;
                                                          }

                                                          // e-mission web images fetched from airtable
                                                          readFields(
                                                              cards,
                                                              records
                                                          );

                                                          // fetched all required data and send
                                                          res.render(
                                                              "project",
                                                              {
                                                                  rootTexts:
                                                                      rootTexts,
                                                                  links: links,
                                                                  sections:
                                                                      sections,
                                                                  images: images,
                                                                  footerRootTexts:
                                                                      footerRootTexts,
                                                                  footerLinks:
                                                                      footerLinks,
                                                                  cards:
                                                                      cards,
                                                              }
                                                          );
                                                      });
                                              });
                                      });
                              });
                      });
              });
      });
});

app.get("/designlab", function (req, res) {
  let rootTexts = {};
  let links = {};
  let sections = {};
  let images = {};
  let cards = {};
  let footerRootTexts = {};
  let footerLinks = {};

  //fetch footer root text
  footerBase("root-texts")
      .select({
          view: "DB",
      })
      .all(function (err, records) {
          if (err) {
              console.error(err);
              return;
          }

          // footer root text fetched from airtable
          readFields(footerRootTexts, records);

          // fetch footer links
          footerBase("links")
              .select({
                  view: "DB",
              })
              .all(function (err, records) {
                  if (err) {
                      console.error(err);
                      return;
                  }

                  // footer links fetched from airtable
                  readFields(footerLinks, records);

                  // fetch e-mission web root texts
                  sectionsBase("root-texts")
                      .select({
                          view: "Designlab",
                      })
                      .all(function (err, records) {
                          if (err) {
                              console.error(err);
                              return;
                          }

                          // e-mission web root texts fetched from airtable
                          readFields(rootTexts, records);

                          // fetch e-mission web links
                          sectionsBase("links")
                              .select({
                                  view: "Designlab",
                              })
                              .all(function (err, records) {
                                  if (err) {
                                      console.error(err);
                                      return;
                                  }

                                  // e-mission web links fetched from airtable
                                  readFields(links, records);

                                  // fetch e-mission web sections
                                  sectionsBase("sections")
                                      .select({
                                          view: "Designlab",
                                      })
                                      .all(function (err, records) {
                                          if (err) {
                                              console.error(err);
                                              return;
                                          }

                                          // e-mission web sections fetched from airtable
                                          readFields(sections, records);

                                          // fetch e-mission web images
                                          sectionsBase("images")
                                              .select({
                                                  view: "Designlab",
                                              })
                                              .all(function (err, records) {
                                                  if (err) {
                                                      console.error(err);
                                                      return;
                                                  }

                                                  // e-mission web images fetched from airtable
                                                  readFields(images, records);

                                                  //fetch kickstart cards
                                                  sectionsBase("cards")
                                                      .select({
                                                          view: "Designlab",
                                                      })
                                                      .all(function (
                                                          err,
                                                          records
                                                      ) {
                                                          if (err) {
                                                              console.error(
                                                                  err
                                                              );
                                                              return;
                                                          }

                                                          // e-mission web images fetched from airtable
                                                          readFields(
                                                              cards,
                                                              records
                                                          );

                                                          // fetched all required data and send
                                                          res.render(
                                                              "project",
                                                              {
                                                                  rootTexts:
                                                                      rootTexts,
                                                                  links: links,
                                                                  sections:
                                                                      sections,
                                                                  images: images,
                                                                  footerRootTexts:
                                                                      footerRootTexts,
                                                                  footerLinks:
                                                                      footerLinks,
                                                                  cards:
                                                                      cards,
                                                              }
                                                          );
                                                      });
                                              });
                                      });
                              });
                      });
              });
      });
});

app.get("/graphics", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch graphics root texts
                    sectionsBase("root-texts")
                        .select({
                            view: "Graphics",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            sectionsBase("links")
                                .select({
                                    view: "Graphics",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    sectionsBase("sections")
                                        .select({
                                            view: "Graphics",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            sectionsBase("images")
                                                .select({
                                                    view: "Graphics",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("graphics", {
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/photography-lockdown", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    photographyBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            photographyBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    photographyBase("lockdown-sections")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            photographyBase("images")
                                                .select({
                                                    view: "DB",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("photography", {
                                                        page: req.url,
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/photography-embodiment", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    photographyBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            photographyBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    photographyBase("embodiment-sections")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            photographyBase("images")
                                                .select({
                                                    view: "DB",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("photography", {
                                                        page: req.url,
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/photography-the-third", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    photographyBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            photographyBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    photographyBase("the-third-sections")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            photographyBase("images")
                                                .select({
                                                    view: "DB",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("photography", {
                                                        page: req.url,
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/photography-berlin-wall", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    photographyBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            photographyBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    photographyBase("berlin-wall-sections")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            photographyBase("images")
                                                .select({
                                                    view: "DB",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("photography", {
                                                        page: req.url,
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/photography-untitled", function (req, res) {
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    photographyBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            photographyBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    photographyBase("untitled-sections")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(sections, records);

                                            // fetch graphics images
                                            photographyBase("images")
                                                .select({
                                                    view: "DB",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // graphics images fetched from airtable
                                                    readFields(images, records);

                                                    // fetched all required data and send
                                                    res.render("photography", {
                                                        page: req.url,
                                                        rootTexts: rootTexts,
                                                        links: links,
                                                        sections: sections,
                                                        images: images,
                                                        footerRootTexts:
                                                            footerRootTexts,
                                                        footerLinks:
                                                            footerLinks,
                                                    });
                                                });
                                        });
                                });
                        });
                });
        });
});

app.get("/contact", function (req, res) {
    let rootTexts = {};
    let links = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};

    //fetch footer root text
    footerBase("root-texts")
        .select({
            view: "DB",
        })
        .all(function (err, records) {
            if (err) {
                console.error(err);
                return;
            }

            // footer root text fetched from airtable
            readFields(footerRootTexts, records);

            // fetch footer links
            footerBase("links")
                .select({
                    view: "DB",
                })
                .all(function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    // footer links fetched from airtable
                    readFields(footerLinks, records);

                    // fetch photographyBase root texts
                    contactBase("root-texts")
                        .select({
                            view: "DB",
                        })
                        .all(function (err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            // graphics root texts fetched from airtable
                            readFields(rootTexts, records);

                            // fetch graphics links
                            contactBase("links")
                                .select({
                                    view: "DB",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // graphics links fetched from airtable
                                    readFields(links, records);

                                    // fetch graphics sections
                                    contactBase("images")
                                        .select({
                                            view: "DB",
                                        })
                                        .all(function (err, records) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }

                                            // graphics sections fetched from airtable
                                            readFields(images, records);

                                            // fetched all required data and send
                                            res.render("contact", {
                                                rootTexts: rootTexts,
                                                links: links,
                                                images: images,
                                                footerRootTexts:
                                                    footerRootTexts,
                                                footerLinks: footerLinks,
                                            });
                                        });
                                });
                        });
                });
        });
});

app.post("/post-message", function (req, res) {
    const postBody = req.body;
    contactBase("message").create(
        [
            {
                fields: {
                    email: postBody.email,
                    name: postBody.name,
                    phone: postBody.phone,
                    message: postBody.message,
                },
            },
        ],
        function (err, records) {
            if (err) {
                console.error(err);
                return;
            }
            // records.forEach(function (record) {
            // console.log(record.getId());
            // });
        }
    );
    console.log(postBody);
    res.send(postBody);
});

app.get("/photography", function (req, res) {
    res.render("photography");
});

app.get("/lockdown", function (req, res) {
    res.render("lockdown");
});

app.get("/foreign", function (req, res) {
    res.render("foreign");
});

app.get("/berlinWall", function (req, res) {
    res.render("berlinWall");
});

app.get("/webProjects", function (req, res) {
    res.render("designProjects");
});

// app.get("/drawings", function(req, res){
//   res.sendFile(__dirname + "/personalwebsite/public/index.html");
// });

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000.");
});
