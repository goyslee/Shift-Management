var express = require("express");
var router = express.Router();
var Colleague = require("../models/colleague");
var Colleagueshiftstate = require("../models/colleagueshiftstate");
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
                res.render("colleagues/colleagues", {
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
                    if (coll.isIn == true && coll.team === 1 || coll.isIn == true && coll.team === 2 || coll.isIn == true && coll.team === 3 || coll.isIn == true && coll.team === 4 || coll.isIn == true && coll.team === 5 || coll.isIn == true && coll.team === 6) {
                        collInNum++;
                    }

                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }
                    if (coll.isIn == true && coll.team === 9) {
                        hygieneNum++;
                    }

                });
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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
                res.render("colleagues/colleagues", {
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

// Earlies team1
router.get("/earlies/team1", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 1, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team1", {tablerow: tablerow});
    });
});


// Earlies team2
router.get("/earlies/team2", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 2, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team2", {tablerow: tablerow});
    });
});


// Earlies team3
router.get("/earlies/team3", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 3, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team3", {tablerow: tablerow});
    });
});


// Earlies team4
router.get("/earlies/team4", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 4, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team4", {tablerow: tablerow});
    });
});


// Earlies team5
router.get("/earlies/team5", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 5, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team5", {tablerow: tablerow});
    });
});


// Earlies team6
router.get("/earlies/team6", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 6, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team6", {tablerow: tablerow});
    });
});


// Earlies team7
router.get("/earlies/team7", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 7, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team7", {tablerow: tablerow});
    });
});


// Earlies team8
router.get("/earlies/team8", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 8, shift: "Earlies"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/earlies/team8", {tablerow: tablerow});
    });
});

// Middles team1
router.get("/middles/team1", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 1, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team1", {tablerow: tablerow});
    });
});


// Middles team2
router.get("/middles/team2", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 2, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team2", {tablerow: tablerow});
    });
});


// Middles team3
router.get("/middles/team3", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 3, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team3", {tablerow: tablerow});
    });
});


// Middles team4
router.get("/middles/team4", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 4, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team4", {tablerow: tablerow});
    });
});


// Middles team5
router.get("/middles/team5", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 5, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team5", {tablerow: tablerow});
    });
});


// Middles team6
router.get("/middles/team6", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 6, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team6", {tablerow: tablerow});
    });
});


// Middles team7
router.get("/middles/team7", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 7, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team7", {tablerow: tablerow});
    });
});


// Middles team8
router.get("/middles/team8", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 8, shift: "Middles"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/middles/team8", {tablerow: tablerow});
    });
});

// Nights team1
router.get("/nights/team1", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 1, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team1", {tablerow: tablerow});
    });
});


// Nights team2
router.get("/nights/team2", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 2, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team2", {tablerow: tablerow});
    });
});


// Nights team3
router.get("/nights/team3", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 3, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team3", {tablerow: tablerow});
    });
});


// Nights team4
router.get("/nights/team4", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 4, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team4", {tablerow: tablerow});
    });
});


// Nights team5
router.get("/nights/team5", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 5, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team5", {tablerow: tablerow});
    });
});


// Nights team6
router.get("/nights/team6", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 6, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team6", {tablerow: tablerow});
    });
});


// Nights team7
router.get("/nights/team7", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 7, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team7", {tablerow: tablerow});
    });
});


// Nights team8
router.get("/nights/team8", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 8, shift: "Nights"}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/nights/team8", {tablerow: tablerow});
    });
});



//pmp
router.get("/pmp", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 10}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            agentcollInNum = 0;
            tablerow.forEach(function(coll) {
                    if (coll.isIn == true && coll.team === 10) {
                        agentcollInNum++;
                    }

                }); 
        }
        res.render("colleagues/pmp", {tablerow: tablerow, agentcollInNum: agentcollInNum});
    });
});

//managers
router.get("/manager", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: null}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/manager", {tablerow: tablerow});
    });
});

// hygiene
//team6
router.get("/hygiene", middleware.isLoggedIn, function(req, res) {
    Colleague.find({team: 9}, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            
        }
        res.render("colleagues/hygiene", {tablerow: tablerow});
    });
});
//LOADERS
//loaders earlies
router.get("/loadingTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({loadingTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/loadingtrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//loaders middles
router.get("/loadingTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({loadingTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/loadingtrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//loaders nights
router.get("/loadingTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({loadingTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/picktrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});
//PICKERS
//pickers earlies
router.get("/pickTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({pickTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/picktrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//pickers middles
router.get("/pickTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({pickTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/picktrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//pickers nights
router.get("/pickTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({pickTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/picktrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});

// CHILL PICKERS
//chillpickers earlies
router.get("/chillPickTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({chillPickTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/chillpicktrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//chillpickers middles
router.get("/chillPickTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({chillPickTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/chillpicktrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//chillpickers nights
router.get("/chillPickTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({chillPickTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/chillpicktrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});

//REACH TRUCK DRIVERS
//drivers earlies
router.get("/rtTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({rtTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/rttrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//drivers middles
router.get("/rtTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({rtTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/rttrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//drivers nights
router.get("/rtTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({rtTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/rttrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});

//De-kit(mts)
//De-kit earlies
router.get("/dekitTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({mtsTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/dekittrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//De-kit middles
router.get("/dekitTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({mtsTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/dekittrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//De-kit nights
router.get("/dekitTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({mtsTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/dekittrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});

//MARSHALLING
//marshalling earlies
router.get("/marshallingTrainedEarlies", middleware.isLoggedIn, function(req, res) {
    Colleague.find({marshallingTrained: true, shift: "Earlies"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/marshallingtrained", {tablerow: tablerow, Whatshift: "Earlies"});
    });
});

//marshalling middles
router.get("/marshallingTrainedMiddles", middleware.isLoggedIn, function(req, res) {
    Colleague.find({marshallingTrained: true, shift: "Middles"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/marshallingtrained", {tablerow: tablerow, Whatshift: "Middles"});
    });
});

//marshalling nights
router.get("/marshallingTrainedNights", middleware.isLoggedIn, function(req, res) {
    Colleague.find({marshallingTrained: true, shift: "Nights"}, null, function(err, tablerow){
        if(err) {
            console.log(err);
        } else {
            console.log(tablerow);
        }
        res.render("colleagues/marshallingtrained", {tablerow: tablerow, Whatshift: "Nights"});
    });
});



//NEW Colleague 
router.get("/newcolleague", middleware.isAdmin, function(req, res) {
    res.render("colleagues/newcolleague");
});


// New colleagues Create Route
router.post("/", middleware.isAdmin, function(req, res) {
    //Create a new Colleague and save it to the database  (DB)
    Colleague.create(req.body.colleague, function(err, newlyCreated) {
        if (err) {
            console.log(err);
            res.render("colleagues/newcolleague");
        } else { 
            //redirect back to campgrounds
            newlyCreated.fullName = newlyCreated.firstName + " " + newlyCreated.lastName;
            newlyCreated.save();
            newlyCreated.holiday = false;
            newlyCreated.isAllocated = false;
            if (!req.body.colleague.startDate) {
                newlyCreated.startDate = Date.now();
            }
            if (newlyCreated.roles[0].tip == true) {
                newlyCreated.roles[0].runner = true
            }
            if (newlyCreated.roles[0].tip == true) {
                newlyCreated.tipTrained = true
            }
            if (newlyCreated.roles[0].loading == true) {
                newlyCreated.loadingTrained = true
            }
            if (newlyCreated.roles[0].marshalling == true) {
                newlyCreated.marshallingTrained = true
            }
            if (newlyCreated.roles[0].pick == true) {
                newlyCreated.pickTrained = true
            }
            if (newlyCreated.roles[0].chutes == true) {
                newlyCreated.chillPickTrained = true
            }
            if (newlyCreated.roles[0].trucks == true) {
                newlyCreated.rtTrained = true
            }
            if (newlyCreated.roles[0].mts == true) {
                newlyCreated.mtsTrained = true
            }
             if (newlyCreated.roles[0].rt == true) {
                newlyCreated.counterBalanceTrained = true
            }

            // if (newlyCreated.roles[0].loading == true) {
            //     newlyCreated.roles[0].sd = true
            // }
            res.redirect("/colleagues"); //nem nyultam hozza
        }
    });
});

// COLLEAGUE SHOW ROUTE
router.get("/:id", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the colleagues with prowided ID
    Colleague.findById(req.params.id).populate("comments").exec(function(err, foundColleague) {
        if (err || !foundColleague) {
            console.log(err);
            req.flash("error", "Colleague record has not found.");
            res.redirect("back");
        } else {
            //render show
            res.render("colleagues/colleagueshow", {
                colleagueinfo: foundColleague
            });
        }
    });

});



// EDIT ROUTE
router.get("/:id/colleagueedit", middleware.isAdmin, function(req, res) {
    Colleague.findById(req.params.id, function(err, foundColleague) {
        if (err) {
            res.redirect("/colleagues"); //nem nyultam hozza
        } else {
            res.render("colleagues/colleagueedit", {
                colleague: foundColleague
            });
        }
    });
});

//UPDATE ROUTE (update as a PUT request)
router.put("/:id", middleware.isAdmin, function(req, res) {
    Colleague.findByIdAndUpdate(req.params.id, req.body.colleague, {new: true}, function(err, updatedColleague) {
        if (err) {
            res.redirect("/colleagues");
        } else {

            updatedColleague.baseHours = 8;
            updatedColleague.actualHours = req.body.actualHours;
            updatedColleague.fullName = updatedColleague.firstName + " " + updatedColleague.lastName;
            
             if (updatedColleague.roles[0].tip == true) {
                updatedColleague.roles[0].runner = true;
            } else {
                updatedColleague.runner = false;
            }
            if (updatedColleague.roles[0].tip == true) {
                updatedColleague.tipTrained = true
            } else {
                updatedColleague.tipTrained = false;
            }
            if (updatedColleague.roles[0].loading == true) {
                updatedColleague.loadingTrained = true
            } else {
                updatedColleague.loadingTrained = false;
            }
            if (updatedColleague.roles[0].marshalling == true) {
                updatedColleague.marshallingTrained = true
            } else {
                updatedColleague.marshallingTrained = false 
            }
            if (updatedColleague.roles[0].pick == true) {
                updatedColleague.pickTrained = true
            } else {
                updatedColleague.pickTrained = false 
            }
            if (updatedColleague.roles[0].chutes == true) {
                updatedColleague.chillPickTrained = true
            } else {
                updatedColleague.chillPickTrained = false 
            }
            if (updatedColleague.roles[0].trucks == true) {
                updatedColleague.rtTrained = true
            } else {
                updatedColleague.rtTrained = false 
            }
            if (updatedColleague.roles[0].mts == true) {
                updatedColleague.mtsTrained = true
            } else {
                updatedColleague.mtsTrained = false 
            }
            if (updatedColleague.roles[0].rt == true) {
                updatedColleague.counterBalanceTrained = true
            } else {
                updatedColleague.counterBalanceTrained = false 
            }
            //  if (updatedColleague.roles[0].loading == true) {
            //     updatedColleague.roles[0].sd = true
            // }
            updatedColleague.save();
            res.redirect("/colleagues/" + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    //destroy blog
    Colleague.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/colleagues");
        } else {
            res.redirect("/colleagues");
        }
    });
    //redirect somewhere
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"); //v15 Fuzzy search
}

module.exports = router;