var express = require("express");
var router = express.Router();
// var Allocation = require("../models/allocation");
var Colleague = require("../models/colleague");
var middleware = require("../middleware");
//Get all colleaguestablerow from DB //INDEX
router.get("/", middleware.isLoggedIn, function(req, res) {
    var noMatch = ""; //v15
    var collInNum = 0;
    var agentcollInNum = 0;
    var hygieneNum = 0;
    if (req.query.search) { //v15
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //v15
        //Get all colleagues, from DB //v15
        Colleague.find({
            lastName: regex
        }, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) { //v15
            if (err) { //v15
                console.log(err); //v15
            } else { //v15
                if (tablerow.length < 1) { //v15
                    noMatch = "There is no colleagues matches with the searched criteria. Please try an another one."; //v15
                } //v15
                res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                }); //v15
            }
        }); //v15
    } else { //v15

        //Get all colleagues, from DB
        Colleague.find({}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {
            if (err) {
                console.log(err);
            } 
            Colleague.find({}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {

                tablerow.forEach(function(coll) {
                    if (coll.isIn == true && coll.team === 1 || coll.isIn == true && coll.team === 2 || coll.isIn == true && coll.team === 3 || coll.isIn == true && coll.team === 4 || coll.isIn == true && coll.team === 5 || coll.isIn == true && coll.team === 6 || coll.isIn == true && coll.team === 7 || coll.isIn == true && coll.team === 8) {
                        collInNum++;
                    }

                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.isIn == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });
                 res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                });
            });


        });
    } //v15
});

// Earlies shift
router.get("/earlies", middleware.isLoggedIn, function(req, res) {
    var noMatch = ""; //v15
    var collInNum = 0;
    var agentcollInNum = 0;
    var hygieneNum = 0;
    if (req.query.search) { //v15
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //v15
        //Get all colleagues, from DB //v15
        Colleague.find({
            lastName: regex, shift: "Earlies"
        }, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) { //v15
            if (err) { //v15
                console.log(err); //v15
            } else { //v15
                if (tablerow.length < 1) { //v15
                    noMatch = "There is no colleagues matches with the searched criteria. Please try an another one."; //v15
                } //v15
                res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                }); //v15
            }
        }); //v15
    } else { //v15

        //Get all colleagues, from DB
        Colleague.find({shift: "Earlies"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {
            if (err) {
                console.log(err);
            } 
            Colleague.find({shift: "Earlies"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {

                tablerow.forEach(function(coll) {
                    if (coll.isIn == true && coll.shift === "Earlies") {
                        collInNum++;
                    }

                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.isIn == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });
                 res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                });
            });


        });
    } //v15
});

// Middles shift
router.get("/middles", middleware.isLoggedIn, function(req, res) {
    var noMatch = ""; //v15
    var collInNum = 0;
    var agentcollInNum = 0;
    var hygieneNum = 0;
    if (req.query.search) { //v15
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //v15
        //Get all colleagues, from DB //v15
        Colleague.find({
            lastName: regex, shift: "Middles"
        }, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) { //v15
            if (err) { //v15
                console.log(err); //v15
            } else { //v15
                if (tablerow.length < 1) { //v15
                    noMatch = "There is no colleagues matches with the searched criteria. Please try an another one."; //v15
                } //v15
                res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                }); //v15
            }
        }); //v15
    } else { //v15

        //Get all colleagues, from DB
        Colleague.find({shift: "Middles"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {
            if (err) {
                console.log(err);
            } 
            Colleague.find({shift: "Middles"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {

                tablerow.forEach(function(coll) {
                    if (coll.isIn == true && coll.shift === "Middles") {
                        collInNum++;
                    }

                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.isIn == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });
                 res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                });
            });


        });
    } //v15
});

// Earlies shift
router.get("/nights", middleware.isLoggedIn, function(req, res) {
    var noMatch = ""; //v15
    var collInNum = 0;
    var agentcollInNum = 0;
    var hygieneNum = 0;
    if (req.query.search) { //v15
        const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //v15
        //Get all colleagues, from DB //v15
        Colleague.find({
            lastName: regex, shift: "Nights"
        }, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) { //v15
            if (err) { //v15
                console.log(err); //v15
            } else { //v15
                if (tablerow.length < 1) { //v15
                    noMatch = "There is no colleagues matches with the searched criteria. Please try an another one."; //v15
                } //v15
                res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                }); //v15
            }
        }); //v15
    } else { //v15

        //Get all colleagues, from DB
        Colleague.find({shift: "Nights"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {
            if (err) {
                console.log(err);
            } 
            Colleague.find({shift: "Nights"}, null, {
            sort: {
                userNumber: 1
            }
        }, function(err, tablerow) {

                tablerow.forEach(function(coll) {
                    if (coll.isIn == true && coll.shift === "Nights") {
                        collInNum++;
                    }

                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.isIn == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });
                 res.render("shift/shift", {
                    hygieneNum: hygieneNum,
                    agentcollInNum: agentcollInNum,
                    collInNum: collInNum,
                    tablerow: tablerow,
                    noMatch: noMatch
                });
            });


        });
    } //v15
});

// Earlies attended
router.get("/earlies/attended", middleware.isLoggedIn, function(req, res) {
    Colleague.find({attended: true, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            var noMatch = "";
            var collInNum = 0;
            var agentcollInNum = 0;
            var hygieneNum = 0;
          tablerow.forEach(function(coll) {
                    if (coll.attended == true && coll.shift === "Earlies") {
                        collInNum++;
                    }

                    if (coll.attended == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.attended == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });  
        }
        res.render("shift/attended", {tablerow: tablerow, 
                                             collInNum: collInNum, 
                                             agentcollInNum: agentcollInNum, 
                                             hygieneNum: hygieneNum,
                                             noMatch: noMatch,  
                                             attendance: "Attended colleagues:"});
    });
});

// Middles attended
router.get("/middles/attended", middleware.isLoggedIn, function(req, res) {
    Colleague.find({attended: true, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            var noMatch = "";
            var collInNum = 0;
            var agentcollInNum = 0;
            var hygieneNum = 0;
          tablerow.forEach(function(coll) {
                    if (coll.attended == true && coll.shift === "Middles") {
                        collInNum++;
                    }

                    if (coll.attended == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.attended == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });  
        }
        res.render("shift/attended", {tablerow: tablerow, 
                                             collInNum: collInNum, 
                                             agentcollInNum: agentcollInNum, 
                                             hygieneNum: hygieneNum,
                                             noMatch: noMatch,  
                                             attendance: "Attended colleagues:"});
    });
});

// Nights attended
router.get("/nights/attended", middleware.isLoggedIn, function(req, res) {
    Colleague.find({attended: true, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            var noMatch = "";
            var collInNum = 0;
            var agentcollInNum = 0;
            var hygieneNum = 0;
          tablerow.forEach(function(coll) {
                    if (coll.attended == true && coll.shift === "Nights") {
                        collInNum++;
                    }

                    if (coll.attended == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.attended == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });  
        }
        res.render("shift/attended", {tablerow: tablerow, 
                                             collInNum: collInNum, 
                                             agentcollInNum: agentcollInNum, 
                                             hygieneNum: hygieneNum,
                                             noMatch: noMatch,  
                                             attendance: "Attended colleagues:"});
    });
});


// New colleagues Create Route
router.post("/", function(req, res) {
    //Create a new Colleague and save it to the database  (DB)
    Colleague.create(req.body.allocation, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            res.render("back");
        } else {
            //redirect back to campgrounds
            res.redirect("/shift"); //nem nyultam hozza
        }
    });
});

// Attended colleague archivation


// COLLEAGUE SHOW ROUTE
router.get("/:id", function(req, res) { //order!!!!!!!!of routes
    //find the colleagues with prowided ID
    Colleague.findById(req.params.id, function(err, foundColleague) {
        if (err || !foundColleague) {
            console.log(err);
            req.flash("error", "Colleague record has not found.");
            res.redirect("back");
        } else {
            //render show
            res.render("colleagues/colleagueshow", {
                allocationinfo: foundColleague
            });
        }
    });

});

// EDIT ROUTE
router.get("/:id/allocationedit", function(req, res) {
    Colleague.findById(req.params.id, function(err, foundColleague) {
        if (err) {
            res.redirect("/colleagues"); //nem nyultam hozza
        } else {
            res.render("colleagues/allocationedit", {
                allocation: foundColleague
            });
        }
    });
});

//BOOK IN ROUTE 
//UPDATE ROUTE (update as a PUT request)
router.put("/:id", function(req, res) {
    Colleague.findById(req.params.id, req.body.colleague, function(err, colleagues) {
        if (err) {
            res.redirect("/shift");
        }
        if (!req.body.colleague) {
            colleagues.holiday = false;
            colleagues.isIn = false;
            colleagues.isAllocated = false;
            colleagues.allocatedLeader = false;
            colleagues.absence = false;
            colleagues.attended = false;
            colleagues.save(colleagues);
            res.redirect("back");
        }
        if (req.body.colleague) {
            colleagues.holiday = req.body.colleague.holiday;
            colleagues.isIn = req.body.colleague.isIn;
            colleagues.isAllocated = false;
            colleagues.allocatedLeader = false;
            colleagues.absence = req.body.colleague.absence;
            colleagues.attended = req.body.colleague.attended;
            if (colleagues.attended == true) {
                colleagues.isIn = colleagues.attended;
            } 


            colleagues.save(colleagues);
            res.redirect("back");
        }

    });

});



// DELETE ROUTE
router.delete("/:id", function(req, res) {
    //destroy blog
    Colleague.findById(req.params.id, req.body.colleague, function(err, colleagues) {
        if (err) {
            res.redirect("/colleagues");
        }
        colleagues.holiday = req.body.colleague.holiday;
        colleagues.isIn = req.body.colleague.isIn;
        colleagues.absence = req.body.colleague.absence;
        colleagues.save(colleagues);
        res.redirect("back");

    });
    //redirect somewhere
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); //v15 Fuzzy search
}

module.exports = router;