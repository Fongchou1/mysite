const express = require("express");
var path = require("path");
var ejs = require("ejs");
const cors = require("cors");
var Airtable = require("airtable");
const bp = require("body-parser");
// var marked = require("marked");
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
    //landing page
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
                                                                            rootRoute:
                                                                                "",
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

//projects
app.get("/projects/:project", function (req, res) {
    const nameOfDatabaseView = req.params.project;
    // console.log(req);
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
                            view: nameOfDatabaseView,
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
                                    view: nameOfDatabaseView,
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
                                            view: nameOfDatabaseView,
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
                                                    view: nameOfDatabaseView,
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
                                                        rootRoute: "../",
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

//blogs
app.get("/blogs/:category", function (req, res) {
    // console.log(req.params);
    let category = req.params.category;
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};
    let blogThumbnails = {};
    let blogCategories = {};

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
                            view: "blogs",
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
                                    view: "blogs",
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
                                            view: "blogs",
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
                                                    view: "blogs",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // e-mission web images fetched from airtable
                                                    readFields(images, records);

                                                    //fetch blog thumbnails
                                                    sectionsBase(
                                                        "blog-thumbnails"
                                                    )
                                                        .select({
                                                            view: "blog-thumbnails",
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

                                                            // blog thumbnails fetched from airtable
                                                            readFields(
                                                                blogThumbnails,
                                                                records
                                                            );

                                                            // fetch blog categories
                                                            sectionsBase(
                                                                "blog-categories"
                                                            )
                                                                .select({
                                                                    view: "blog-categories",
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
                                                                        blogCategories,
                                                                        records
                                                                    );

                                                                    // fetched all required data and send
                                                                    res.render(
                                                                        "blogsPage",
                                                                        {
                                                                            rootRoute:
                                                                                "",
                                                                            category:
                                                                                category,
                                                                            rootTexts:
                                                                                rootTexts,
                                                                            links: links,
                                                                            sections:
                                                                                sections,
                                                                            images: images,
                                                                            blogThumbnails:
                                                                                blogThumbnails,
                                                                            blogCategories:
                                                                                blogCategories,
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

app.get("/blogs/:category/:blog", function (req, res) {
    // console.log(req.params);
    let category = req.params.category;
    let blogTitle = req.params.blog;
    let rootTexts = {};
    let links = {};
    let sections = {};
    let images = {};
    let footerRootTexts = {};
    let footerLinks = {};
    let blogThumbnails = {};
    let blog = {};
    let selectedBlog = {}
    let selectedBlogThumbnail = {}

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
                            view: "blog",
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
                                    view: "blog",
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
                                            view: "blog",
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
                                                    view: "blog",
                                                })
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
                                                        return;
                                                    }

                                                    // e-mission web images fetched from airtable
                                                    readFields(images, records);

                                                    //fetch blog thumbnails
                                                    sectionsBase(
                                                        "blog-thumbnails"
                                                    )
                                                        .select({
                                                            view: "blog-thumbnails",
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

                                                            const selectedBlogThumbnailAsArray = records.filter( record => (record.fields['blog-title-link'][0]) === blogTitle)
                                                            selectedBlogThumbnail = selectedBlogThumbnailAsArray[0];

                                                            // blog thumbnails fetched from airtable
                                                            readFields(
                                                                blogThumbnails,
                                                                records
                                                            );

                                                            // fetch blog categories
                                                            sectionsBase(
                                                                "blog"
                                                            )
                                                                .select({
                                                                    view: "blog",
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

                                                                    const selectedBlogAsArray = records.filter( record => record.fields.title === blogTitle)
                                                                    selectedBlog = selectedBlogAsArray[0];

                                                                    // e-mission web images fetched from airtable
                                                                    // readFields(
                                                                    //     blog,
                                                                    //     records
                                                                    // );

                                                                    // fetched all required data and send
                                                                    res.render(
                                                                        "blog",
                                                                        {
                                                                            rootRoute:
                                                                                "../../",
                                                                            category:
                                                                                category,
                                                                            rootTexts:
                                                                                rootTexts,
                                                                            links: links,
                                                                            sections:
                                                                                sections,
                                                                            images: images,
                                                                            blogThumbnails:
                                                                                blogThumbnails,
                                                                            selectedBlogThumbnail: 
                                                                                selectedBlogThumbnail,
                                                                            selectedBlog:
                                                                                selectedBlog,
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

app.get("/services", async function (req, res) {
    // res.sendFile(__dirname + "/index.html");

    let rootTexts = {};
    let links = {};
    let images = {};
    let sections = {};
    let cards = {};
    let footerRootTexts = {};
    let footerLinks = {};

    // airtable
    await sectionsBase("root-texts")
        .select({
            view: "Services",
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
                    view: "Services",
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
                            view: "Services",
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
                                    view: "Services",
                                })
                                .all(function (err, records) {
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }

                                    // sections fetched from airtable
                                    readFields(sections, records);

                                    sectionsBase("cards")
                                        .select({
                                            view: "Services",
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
                                                .all(function (err, records) {
                                                    if (err) {
                                                        console.error(err);
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
                                                                "sectionsPage",
                                                                {
                                                                    rootRoute:
                                                                        "",
                                                                    rootTexts:
                                                                        rootTexts,
                                                                    links: links,
                                                                    images: images,
                                                                    sections:
                                                                        sections,
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
                                                        rootRoute: "",
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
                                                        rootRoute: "",
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
                                                        rootRoute: "",
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
                                                        rootRoute: "",
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
                                                        rootRoute: "",
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
                                                rootRoute: "",
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

// app.get("/drawings", function(req, res){
//   res.sendFile(__dirname + "/personalwebsite/public/index.html");
// });

app.listen(process.env.PORT || 8080, function () {
    console.log("Server started at port 8080.");
});
