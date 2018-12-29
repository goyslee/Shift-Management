var express = require("express");
var router = express.Router();
var Allocator = require("../models/allocator");
var Picker = require("../models/picker");
var Driver = require("../models/driver");
var Chute = require("../models/chute");
var Csc = require("../models/csc");
var Mts = require("../models/mts");
var Tipper = require("../models/tipper");
var Loader = require("../models/loader");
var Baler = require("../models/baler");
var Hygiene = require("../models/hygiene");
var ManualPick = require("../models/manual_pick");
var Racking = require("../models/racking");
var Rb = require("../models/rb");
var Rt = require("../models/rt");
var Runner = require("../models/runner");
var Training = require("../models/training");
var Union = require("../models/union");
var Yard = require("../models/yard");
var Vls = require("../models/vls");
var Sd = require("../models/sd");
var Pickmanager = require("../models/pickmanager");
var Chutemanager = require("../models/chutemanager");
var Truckmanager = require("../models/truckmanager");
var Office = require("../models/office");
var Colleague = require("../models/colleague");
var middleware = require("../middleware");
var pickMen = 0,
    chuteMen = 0,
    loader = 0,
    truckDriver = 0,
    mtsMen = 1,
    rebadgeMen = 0,
    tipMen = 0;
var bCount = 0;
var pNeed = 0;
var lNeed = 0;
var tNeed = 0;
var tdNeed = 0;
var runner = 0;
var allocatedPicker = 0;
var allocatedDriver = 0;
var allocatedMts = 0;
var allocatedTipper = 0;
var allocatedCsc = 0;
var allocatedRt = 0;
var allocatedRunner = 0;
var allocatedLoader = 0;
var allocatedChute = 0;
var allocatedRb = 0;
var minimumRate = 8;
//Get all allocatortablerow from DB //INDEX
router.get("/", middleware.isLoggedIn, function(req, res) {
    //Get all allocator, from DB //v15
    Allocator.find({}, function(err, tablerow) {
        if (err) {
            console.log(err);
        } else {
            res.render("allocator/allocator", {
                tablerow: tablerow
            });
        }
    });
});
//INDEX OF ARCHIVED SHEETS
router.get("/archived", middleware.isLoggedIn, function(req, res) {
    //Get all allocator, from DB //v15
    Allocator.find({}, function(err, tablerow) {
        if (err) {
            console.log(err);
        } else {
            res.render("allocator/archived", {
                foundAllocation: tablerow
            });
        }
    });
});
//NEW ROUTE
router.get("/allocations", middleware.isLoggedIn, function(req, res) {
    Allocator.find({}, function(err, foundAllocation) {
        if (err) {
            console.log(err);
        } else {
            res.render("allocator/allocations", {
                foundAllocation: foundAllocation
            });
        }
    });
});
// New allocator Create Route
router.post("/", middleware.isLoggedIn, function(req, res) {
    //Create a new Allocator and save it to the database  (DB)
    Allocator.find({}, function(err, foundAllocator) { // ez veglegesiti az elozo shift setupot
        foundAllocator.forEach(function(allocator) {
            allocator.isAllocated = true;
            allocator.save();
        });
    });
    Colleague.find({}, function(err, foundColleague) {
        foundColleague.forEach(function(colleague) {
            colleague.allocatedLeader = false;
            colleague.isAllocated = false;
            colleague.save();
        });
    });
    Allocator.create(req.body.allocator, function(err, newlyCreated) {
        if (err) {
            if (err.code === 11000 || err.code === 11001) {
                Allocator.findOne().sort({
                    field: 'asc',
                    _id: -1
                }).limit(1).exec(function(err, foundAllocation) {
                    if (err) {
                        console.log(err);
                    } else {
                        foundAllocation.isAllocated = false;
                        foundAllocation.save();
                    }
                });
                req.flash("error", "There is a shift set up under this date already! PLease edit the existing one or delete it first");
                res.redirect("back");
            }
            console.log(err);
            res.render("allocator/allocator");
        } else {
            Allocator.find({}, function(err, foundAllocation) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("success", "Sheet is ready to set up. Click Allocator > Job Sheets to find record.");
                    res.redirect("back");
                }
            });
        }
    });
});
// ALLOCATOR SHOW ROUTE
router.get("/allocations/allocationshow/:id", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    var jsHours = 0;
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err || !foundAllocator) {
            console.log(err);
            req.flash("error", "Allocator record has not found.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err)
                } else {
                    Driver.find({}, function(err, foundDriver) {
                        if (err || !foundDriver) {
                            console.log(err);
                        } else {
                            Picker.find({}, function(err, foundPicker) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    Chute.find({}, function(err, foundChute) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            Rt.find({}, function(err, foundRt) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    Tipper.find({}, function(err, foundTipper) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            Runner.find({}, function(err, foundRunner) {
                                                                if (err) {
                                                                    console.log(err);
                                                                } else {
                                                                    Mts.find({}, function(err, foundMts) {
                                                                        if (err) {
                                                                            console.log(err);
                                                                        } else {
                                                                            Rb.find({}, function(err, foundRb) {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                } else {
                                                                                    Csc.find({}, function(err, foundCsc) {
                                                                                        if (err) {
                                                                                            console.log(err);
                                                                                        } else {
                                                                                            Hygiene.find({}, function(err, foundHygiene) {
                                                                                                if (err) {
                                                                                                    console.log(err);
                                                                                                } else {
                                                                                                    Baler.find({}, function(err, foundBaler) {
                                                                                                        if (err) {
                                                                                                            console.log(err);
                                                                                                        } else {
                                                                                                            Loader.find({}, function(err, foundLoader) {
                                                                                                                if (err) {
                                                                                                                    console.log(err);
                                                                                                                } else {
                                                                                                                    Yard.find({}, function(err, foundYard) {
                                                                                                                        if (err) {
                                                                                                                            console.log(err);
                                                                                                                        } else {
                                                                                                                            Racking.find({}, function(err, foundRacking) {
                                                                                                                                if (err) {
                                                                                                                                    console.log(err);
                                                                                                                                } else {
                                                                                                                                    ManualPick.find({}, function(err, foundManualpick) {
                                                                                                                                        if (err) {
                                                                                                                                            console.log(err);
                                                                                                                                        } else {
                                                                                                                                            Training.find({}, function(err, foundTraining) {
                                                                                                                                                if (err) {
                                                                                                                                                    console.log(err);
                                                                                                                                                } else {
                                                                                                                                                    Union.find({}, function(err, foundUnion) {
                                                                                                                                                        if (err) {
                                                                                                                                                            console.log(err);
                                                                                                                                                        } else {
                                                                                                                                                            Vls.find({}, function(err, foundVls) {
                                                                                                                                                                if (err) {
                                                                                                                                                                    console.log(err);
                                                                                                                                                                } else {
                                                                                                                                                                    Pickmanager.find({}, function(err, foundPickmanager) {
                                                                                                                                                                        if (err) {
                                                                                                                                                                            console.log(err);
                                                                                                                                                                        } else {
                                                                                                                                                                            Chutemanager.find({}, function(err, foundChutemanager) {
                                                                                                                                                                                if (err) {
                                                                                                                                                                                    console.log(err);
                                                                                                                                                                                } else {
                                                                                                                                                                                    Truckmanager.find({}, function(err, foundTruckmanager) {
                                                                                                                                                                                        if (err) {
                                                                                                                                                                                            console.log(err);
                                                                                                                                                                                        } else {
                                                                                                                                                                                            Office.find({}, function(err, foundOffice) {
                                                                                                                                                                                                if (err) {
                                                                                                                                                                                                    console.log(err);
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    Sd.find({}, function(err, foundSd) {
                                                                                                                                                                                                        if (err) {
                                                                                                                                                                                                            console.log(err);
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                            //render show
                                                                                                                                                                                                            res.render("allocator/allocationshow", {
                                                                                                                                                                                                                foundColleague: foundColleague,
                                                                                                                                                                                                                allocatorinfo: foundAllocator,
                                                                                                                                                                                                                foundDriver: foundDriver,
                                                                                                                                                                                                                foundPicker: foundPicker,
                                                                                                                                                                                                                foundChute: foundChute,
                                                                                                                                                                                                                foundRt: foundRt,
                                                                                                                                                                                                                foundTipper: foundTipper,
                                                                                                                                                                                                                foundRunner: foundRunner,
                                                                                                                                                                                                                foundMts: foundMts,
                                                                                                                                                                                                                foundRb: foundRb,
                                                                                                                                                                                                                foundCsc: foundCsc,
                                                                                                                                                                                                                foundHygiene: foundHygiene,
                                                                                                                                                                                                                foundBaler: foundBaler,
                                                                                                                                                                                                                foundLoader: foundLoader,
                                                                                                                                                                                                                foundYard: foundYard,
                                                                                                                                                                                                                foundRacking: foundRacking,
                                                                                                                                                                                                                foundManualpick: foundManualpick,
                                                                                                                                                                                                                foundTraining: foundTraining,
                                                                                                                                                                                                                foundUnion: foundUnion,
                                                                                                                                                                                                                foundVls: foundVls,
                                                                                                                                                                                                                foundPickmanager: foundPickmanager,
                                                                                                                                                                                                                foundChutemanager: foundChutemanager,
                                                                                                                                                                                                                foundTruckmanager: foundTruckmanager,
                                                                                                                                                                                                                foundOffice: foundOffice,
                                                                                                                                                                                                                foundSd: foundSd
                                                                                                                                                                                                            });
                                                                                                                                                                                                        }
                                                                                                                                                                                                    });
                                                                                                                                                                                                }
                                                                                                                                                                                            });
                                                                                                                                                                                        }
                                                                                                                                                                                    });
                                                                                                                                                                                }
                                                                                                                                                                            });
                                                                                                                                                                        }
                                                                                                                                                                    });
                                                                                                                                                                }
                                                                                                                                                            });
                                                                                                                                                        }
                                                                                                                                                    });
                                                                                                                                                }
                                                                                                                                            });
                                                                                                                                        }
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
//*****************
// DRIVERS ROUTES *
//*****************
// DRIVER SHOW ROUTE
router.get("/:id/drivershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("drivers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Driver.find({}, function(err, foundDriver) {
                        if (err || !foundDriver) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/drivershow", {
                                allocatorinfo: foundAllocator,
                                foundDriver: foundDriver,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//DRIVER UPDATE ROUTE Working fully
router.post("/:id/drivershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.driver
            }, function(err, foundColleague) {
                console.log(foundColleague);
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.driver;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newDriver = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Driver.create(newDriver, function(err, driver) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(driver);
                            foundAllocator.trucks.push(driver);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// PICKERS ROUTES *
//*****************
// PICKER SHOW ROUTE
router.get("/:id/pickershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("pickers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Picker.find({}, function(err, foundPicker) {
                        if (err || !foundPicker) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/pickershow", {
                                allocatorinfo: foundAllocator,
                                foundPicker: foundPicker,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//PICKER UPDATE ROUTE Working fully
router.post("/:id/pickershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.picker
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].save();
                    console.log(foundColleague[0].isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.picker;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newPicker = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Picker.create(newPicker, function(err, picker) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(picker);
                            foundAllocator.pickers.push(picker);
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// CHUTES ROUTES *
//*****************
// CHUTE SHOW ROUTE
router.get("/:id/chuteshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("chutes").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Chute.find({}, function(err, foundChute) {
                        if (err || !foundChute) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/chuteshow", {
                                allocatorinfo: foundAllocator,
                                foundChute: foundChute,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//CHUTE UPDATE ROUTE Working fully
router.post("/:id/chuteshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.chute
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.chute;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newChute = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Chute.create(newChute, function(err, chute) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(chute);
                            foundAllocator.chutes.push(chute);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// REACH TRUCK ROUTES *
//*****************
// REACH TRUCK SHOW ROUTE
router.get("/:id/rtshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("rts").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Rt.find({}, function(err, foundRt) {
                        if (err || !foundRt) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/rtshow", {
                                allocatorinfo: foundAllocator,
                                foundRt: foundRt,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//REACH TRUCK UPDATE ROUTE Working fully
router.post("/:id/rtshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.rt
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.rt;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newRt = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Rt.create(newRt, function(err, rt) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(rt);
                            foundAllocator.rt.push(rt);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// TIPPERS ROUTES *
//*****************
// TIPPER SHOW ROUTE
router.get("/:id/tippershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("tippers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Tipper.find({}, function(err, foundTipper) {
                        if (err || !foundTipper) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/tippershow", {
                                allocatorinfo: foundAllocator,
                                foundTipper: foundTipper,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//TIPPER UPDATE ROUTE Working fully
router.post("/:id/tippershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.tipper
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.tipper;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newTipper = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Tipper.create(newTipper, function(err, tipper) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(tipper);
                            foundAllocator.tip.push(tipper);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// RUNNERS ROUTES *
//*****************
// RUNNER SHOW ROUTE
router.get("/:id/runnershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("runners").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Runner.find({}, function(err, foundRunner) {
                        if (err || !foundRunner) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/runnershow", {
                                allocatorinfo: foundAllocator,
                                foundRunner: foundRunner,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//RUNNER UPDATE ROUTE Working fully
router.post("/:id/runnershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.runner
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.runner;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newRunner = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Runner.create(newRunner, function(err, runner) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(runner);
                            foundAllocator.runner.push(runner);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// MTS ROUTES *
//*****************
// MTS SHOW ROUTE
router.get("/:id/mtsshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("mtss").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Mts.find({}, function(err, foundMts) {
                        if (err || !foundMts) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/mtsshow", {
                                allocatorinfo: foundAllocator,
                                foundMts: foundMts,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//MTS UPDATE ROUTE Working fully
router.post("/:id/mtsshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.mts
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.mts;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newMts = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Mts.create(newMts, function(err, mts) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(mts);
                            foundAllocator.mts.push(mts);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// RB ROUTES *
//*****************
// RB SHOW ROUTE
router.get("/:id/rbshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("rbs").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Rb.find({}, function(err, foundRb) {
                        if (err || !foundRb) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/rbshow", {
                                allocatorinfo: foundAllocator,
                                foundRb: foundRb,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//RB UPDATE ROUTE Working fully
router.post("/:id/rbshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.rb
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.rb;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newRb = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Rb.create(newRb, function(err, rb) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(rb);
                            foundAllocator.rb.push(rb);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// CSC ROUTES *
//*****************
// CSC SHOW ROUTE
router.get("/:id/cscshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("csc").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Csc.find({}, function(err, foundCsc) {
                        if (err || !foundCsc) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/cscshow", {
                                allocatorinfo: foundAllocator,
                                foundCsc: foundCsc,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//CSC UPDATE ROUTE Working fully
router.post("/:id/cscshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.csc
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.csc;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newCsc = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Csc.create(newCsc, function(err, csc) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(csc);
                            foundAllocator.csc.push(csc);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// HYGIENE ROUTES *
//*****************
// HYGIENE SHOW ROUTE
router.get("/:id/hygieneshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("hygiene").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Hygiene.find({}, function(err, foundHygiene) {
                        if (err || !foundHygiene) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/hygieneshow", {
                                allocatorinfo: foundAllocator,
                                foundHygiene: foundHygiene,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//HYGIENE UPDATE ROUTE Working fully
router.post("/:id/hygieneshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.hygiene
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.hygiene;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newHygiene = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Hygiene.create(newHygiene, function(err, hygiene) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(hygiene);
                            foundAllocator.hygiene.push(hygiene);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// BALER ROUTES *
//*****************
// BALER SHOW ROUTE
router.get("/:id/balershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("balers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Baler.find({}, function(err, foundBaler) {
                        if (err || !foundBaler) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/balershow", {
                                allocatorinfo: foundAllocator,
                                foundBaler: foundBaler,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//BALER UPDATE ROUTE Working fully
router.post("/:id/balershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.baler
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.baler;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newBaler = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Baler.create(newBaler, function(err, baler) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(baler);
                            foundAllocator.trucks.push(baler);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// LOADER ROUTES *
//*****************
// LOADER SHOW ROUTE
router.get("/:id/loadershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("loaders").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Loader.find({}, function(err, foundLoader) {
                        if (err || !foundLoader) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/loadershow", {
                                allocatorinfo: foundAllocator,
                                foundLoader: foundLoader,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//LOADER UPDATE ROUTE Working fully
router.post("/:id/loadershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.loader
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.loader;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newLoader = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Loader.create(newLoader, function(err, loader) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(loader);
                            foundAllocator.loading.push(loader);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// YARD ROUTES *
//*****************
// YARD SHOW ROUTE
router.get("/:id/yardshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("yards").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Yard.find({}, function(err, foundYard) {
                        if (err || !foundYard) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/yardshow", {
                                allocatorinfo: foundAllocator,
                                foundYard: foundYard,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//YARD UPDATE ROUTE Working fully
router.post("/:id/yardshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.yard
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.yard;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newYard = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Yard.create(newYard, function(err, yard) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(yard);
                            foundAllocator.yard.push(yard);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// RACKING ROUTES *
//*****************
// RACKING SHOW ROUTE
router.get("/:id/rackingshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("rackings").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Racking.find({}, function(err, foundRacking) {
                        if (err || !foundRacking) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/rackingshow", {
                                allocatorinfo: foundAllocator,
                                foundRacking: foundRacking,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//RACKING UPDATE ROUTE Working fully
router.post("/:id/rackingshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.racking
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.racking;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newRacking = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Racking.create(newRacking, function(err, racking) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(racking);
                            foundAllocator.racking.push(racking);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// MANUAL PICK ROUTES *
//*****************
// MANUAL PICK SHOW ROUTE
router.get("/:id/manualpickshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("manualpicks").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    ManualPick.find({}, function(err, foundManualpick) {
                        if (err || !foundManualpick) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/manualpickshow", {
                                allocatorinfo: foundAllocator,
                                foundManualpick: foundManualpick,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//MANUAL PICK UPDATE ROUTE Working fully
router.post("/:id/manualpickshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.manualpick
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.manualpick;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newManualpick = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    ManualPick.create(newManualpick, function(err, manualpick) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(manualpick);
                            foundAllocator.manual_pick.push(manualpick);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// TRAINING ROUTES *
//*****************
// TRAINING SHOW ROUTE
router.get("/:id/trainingshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("training").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Training.find({}, function(err, foundTraining) {
                        if (err || !foundTraining) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/trainingshow", {
                                allocatorinfo: foundAllocator,
                                foundTraining: foundTraining,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//TRAINING UPDATE ROUTE Working fully
router.post("/:id/trainingshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.training
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.training;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newTraining = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Training.create(newTraining, function(err, training) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(training);
                            foundAllocator.training.push(training);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// UNION ROUTES *
//*****************
// UNION SHOW ROUTE
router.get("/:id/unionshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("union").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Union.find({}, function(err, foundUnion) {
                        if (err || !foundUnion) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/unionshow", {
                                allocatorinfo: foundAllocator,
                                foundUnion: foundUnion,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//UNION UPDATE ROUTE Working fully
router.post("/:id/unionshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.union
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.union;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newUnion = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Union.create(newUnion, function(err, union) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(union);
                            foundAllocator.union.push(union);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// VLS ROUTES *
//*****************
// VLS SHOW ROUTE
router.get("/:id/vlsshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("vlss").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Vls.find({}, function(err, foundVls) {
                        if (err || !foundVls) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/vlsshow", {
                                allocatorinfo: foundAllocator,
                                foundVls: foundVls,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//VLS UPDATE ROUTE Working fully
router.post("/:id/vlsshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.vls
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.vls;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newVls = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Vls.create(newVls, function(err, vls) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(vls);
                            foundAllocator.vls.push(vls);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// PICKMANAGER ROUTES *
//*****************
// PICKMANAGER SHOW ROUTE
router.get("/:id/pickmanagershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("pickmanagers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Pickmanager.find({}, function(err, foundPickmanager) {
                        if (err || !foundPickmanager) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/pickmanagershow", {
                                allocatorinfo: foundAllocator,
                                foundPickmanager: foundPickmanager,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//PICKMANAGER UPDATE ROUTE Working fully
router.post("/:id/pickmanagershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.pickmanager
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.pickmanager;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newPickmanager = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Pickmanager.create(newPickmanager, function(err, pickmanager) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(pickmanager);
                            foundAllocator.trucks.push(pickmanager);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// CHUTEMANAGER ROUTES *
//*****************
// CHUTEMANAGER SHOW ROUTE
router.get("/:id/chutemanagershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("chutemanagers").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Chutemanager.find({}, function(err, foundChutemanager) {
                        if (err || !foundChutemanager) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/chutemanagershow", {
                                allocatorinfo: foundAllocator,
                                foundChutemanager: foundChutemanager,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//CHUTEMANAGER UPDATE ROUTE Working fully
router.post("/:id/chutemanagershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.chutemanager
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.chutemanager;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newChutemanager = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Chutemanager.create(newChutemanager, function(err, chutemanager) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(chutemanager);
                            foundAllocator.chutemanager.push(chutemanager);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// TRUCKMANAGER ROUTES *
//*****************
// TRUCKMANAGER SHOW ROUTE
router.get("/:id/truckmanagershow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("truckmanager").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Truckmanager.find({}, function(err, foundTruckmanager) {
                        if (err || !foundTruckmanager) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/truckmanagershow", {
                                allocatorinfo: foundAllocator,
                                foundTruckmanager: foundTruckmanager,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//TRUCKMANAGER UPDATE ROUTE Working fully
router.post("/:id/truckmanagershow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.truckmanager
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.truckmanager;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newTruckmanager = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Truckmanager.create(newTruckmanager, function(err, truckmanager) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(truckmanager);
                            foundAllocator.truckmanager.push(truckmanager);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
//*****************
// OFFICE ROUTES *
//*****************
// OFFICE SHOW ROUTE
router.get("/:id/officeshow", middleware.isLoggedIn, function(req, res) { //order!!!!!!!!of routes
    //find the allocator with prowided ID
    Allocator.findById(req.params.id).populate("offices").exec(function(err, foundAllocator) {
        if (err) {
            console.log(err);
            req.flash("error", "Something Went wrong.");
            res.redirect("back");
        } else {
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    Office.find({}, function(err, foundOffice) {
                        if (err || !foundOffice) {
                            console.log(err);
                        } else {
                            //render show
                            res.render("allocator/officeshow", {
                                allocatorinfo: foundAllocator,
                                foundOffice: foundOffice,
                                foundColleague: foundColleague
                            });
                        }
                    });
                }
            });
        }
    });
});
//OFFICE UPDATE ROUTE Working fully
router.post("/:id/officeshow", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
        } else {
            Colleague.find({
                fullName: req.body.office
            }, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else if (!foundColleague.length) {
                    console.log("There is nobody added on shift trained for his task!");
                } else {
                    foundColleague[0].allocatedLeader = true;
                    foundColleague[0].isAllocated = true;
                    foundColleague[0].save();
                    console.log(foundColleague.isAllocated);
                    console.log(foundColleague[0].id);
                    console.log(req.body);
                    var text = req.body.office;
                    // console.log(text);
                    var author = {
                        id: foundAllocator.id
                    };
                    var colleagueId = foundColleague[0].id //new
                        //new
                    var newOffice = {
                        text: text,
                        author: author,
                        colleagueId: colleagueId //new
                    };
                    Office.create(newOffice, function(err, office) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(office);
                            foundAllocator.office.push(office);
                            // foundAllocator.isAllocated = true; //kesobb!!!
                            foundAllocator.save();
                        }
                    });
                }
            });
        }
    });
    res.redirect("back");
});
// EDIT ROUTE
router.get("/:id/allocatorManualEdit", middleware.isLoggedIn, function(req, res) {
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            res.redirect("/allocator"); //nem nyultam hozza
        } else {
            res.render("allocator/allocatorManualEdit", {
                allocator: foundAllocator
            });
        }
    });
}); //ez mashova kell
//UPDATE ROUTE (update as a PUT request) //ez csinalja meg a vegleges rutint
router.post("/:id", middleware.isLoggedIn, function(req, res) {
    var pickers = []; //used**
    var drivers = []; //used
    var mtsC = []; //used
    var tippers = []; // used
    var cscC = []; // used
    var rtC = []; //used
    var runnerC = []; //used
    var loaders = []; // used
    var chutes = [];
    var rbC = [];
    var bCount = 0;
    var pickerCount = 0; //used**
    var driverCount = 0; //used
    var mtsCount = 0; //used
    var cscCount = 0; //used
    var rtCount = 0; //used
    var tipCount = 0; //used
    var runnerCount = 0; //used
    var loaderCount = 0; //used
    var chuterCount = 0;
    var rbCount = 0;
    Allocator.findById(req.params.id, function(err, foundAllocator) {
        if (err) {
            console.log(err);
            res.redirect("/allocationshow");
        } else if (foundAllocator.allocatedSheet == true) {
            req.flash("error", "This sheet has been allocated already using automatic method. If you wish to change anything, please do it manually!");
            res.redirect("back");
        } else {
            console.log(Date.now);
            foundAllocator.allocatedSheet = true;
            foundAllocator.save()
                //get picker need
            pNeed = foundAllocator.pickTarget / 180 / 8;
            pickMen = Math.round(pNeed);
            // get chutmensneed
            chuteMen = pickMen * 2 + 1;
            // get loaders need
            lNeed = foundAllocator.loadTarget / 12;
            loader = Math.round(lNeed);
            // get tipersNeed
            tNeed = foundAllocator.tipTarget / 15;
            tipMen = Math.round(tNeed / 8);
            // get truckdriverNeed
            tdNeed = foundAllocator.tipTarget / 10;
            console.log(tdNeed + " driver needed.");
            truckDriver = Math.round(tdNeed / 8);
            runner = 1;
            mts = 1;
            csc = 1;
            rt = 1;
            rb = 0;
            if (foundAllocator.rebadge == true) {
                rb = 1;
            }
            //get colleagues in and allocate
            Colleague.find({}, function(err, foundColleague) {
                if (err) {
                    console.log(err);
                } else {
                    // ***********
                    // *  COUNTS *
                    // ***********
                    foundColleague.forEach(function(colleague) {
                        if (colleague.isIn && colleague.isIn == true && colleague.allocatedLeader == false) {
                            colleague.isAllocated = false;
                            bCount++;
                        }
                    });
                    //**********************
                    //RB ALLOCATION STARTS* eza vegso
                    //**********************
                    minimumRate = 1;
                    foundColleague.forEach(function(colleague) {
                        if (rbCount != rb) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].rb == true) {
                                if (colleague.rating[0].rb >= minimumRate) {
                                    var rbColleague = colleague.firstName + " " + colleague.lastName;
                                    rbCount++;
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    rbC.push(rbColleague);
                                }
                            }
                        }
                    });
                    console.log(rbC + "(Will be the rb Colleague)");
                    //rb allocation
                    rbC.forEach(function(foundRb) {
                        var text = "";
                        text = foundRb;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newRb = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Rb.create(newRb, function(err, rb) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(rb);
                                foundAllocator.rb.push(rb);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedRb++;
                            }
                        });
                    });
                    if (allocatedRb < rb) {
                        rbC = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            //*******************************
                            if (rbCount - rb < 0) {
                                //**************************
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].rb == true) {
                                    if (colleague.rating[0].rb >= minimumRate) {
                                        var rb = colleague.firstName + " " + colleague.lastName;
                                        rbCount = rb;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        rbC.push(rb);
                                    }
                                }
                            }
                        });
                        rbC.forEach(function(foundRb) {
                            var text = "";
                            text = foundRb;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newRb = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Rb.create(newRb, function(err, rb) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save driver
                                    rb.save();
                                    /// Driver.find?? push driver.id?
                                    foundAllocator.rb.push(rb);
                                    foundAllocator.save();
                                    allocatedRb++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - rb;
                    console.log(rb + " Rb colleague has been allocated!");
                    console.log(rbCount);
                    // *******************
                    //RB ALLOCATION ENDS*
                    // *******************
                    //**********************
                    //MTS ALLOCATION STARTS*
                    //**********************
                    minimumRate = 10;
                    foundColleague.forEach(function(colleague) {
                        if (mtsCount != mts) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].mts == true) {
                                if (colleague.rating[0].mts >= minimumRate) {
                                    var mtsColleague = colleague.firstName + " " + colleague.lastName;
                                    mtsCount++;
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    mtsC.push(mtsColleague);
                                }
                            }
                        }
                    });
                    console.log(mtsC + "(Will be the mts Colleague)");
                    //mts allocation
                    mtsC.forEach(function(foundMts) {
                        var text = "";
                        text = foundMts;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newMts = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Mts.create(newMts, function(err, mts) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(mts);
                                foundAllocator.mts.push(mts);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedMts++;
                            }
                        });
                    });
                    if (allocatedMts < mts) {
                        mtsC = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (mtsCount - mts < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].mts == true) {
                                    if (colleague.rating[0].mts >= minimumRate) {
                                        var mts = colleague.firstName + " " + colleague.lastName;
                                        mtsCount = mts;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        mtsC.push(mts);
                                    }
                                }
                            }
                        });
                        mtsC.forEach(function(foundMts) {
                            var text = "";
                            text = foundMts;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newMts = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Mts.create(newMts, function(err, mts) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save driver
                                    mts.save();
                                    /// Driver.find?? push driver.id?
                                    foundAllocator.mts.push(mts);
                                    foundAllocator.save();
                                    allocatedMts++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - mts;
                    console.log(mts + " Mts colleague has been allocated!");
                    console.log(mtsCount);
                    // *******************
                    //MTS ALLOCATION ENDS*
                    // *******************
                    //**********************
                    //*RT ALLOCATION STARTS*
                    //**********************
                    foundColleague.forEach(function(colleague) {
                        if (rtCount != rt) { //
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].rt == true) { //
                                if (colleague.rating[0].rt >= minimumRate) { //
                                    var rtColleague = colleague.firstName + " " + colleague.lastName;
                                    rtCount++;
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    rtC.push(rtColleague); //
                                }
                            }
                        }
                    });
                    console.log(rtC + "(Will be the Reach Truck Driver.)");
                    //rt allocation
                    rtC.forEach(function(foundRt) {
                        var text = "";
                        text = foundRt;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newRt = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Rt.create(newRt, function(err, rt) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(rt);
                                foundAllocator.rt.push(rt);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedRt++;
                            }
                        });
                    });
                    if (allocatedRt < rt) {
                        rtC = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (rtCount - rt < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].rt == true) {
                                    if (colleague.rating[0].rt >= minimumRate) {
                                        var rt = colleague.firstName + " " + colleague.lastName;
                                        rtCount = rt;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        rtC.push(rt);
                                    }
                                }
                            }
                        });
                        rtC.forEach(function(foundRt) {
                            var text = "";
                            text = foundRt;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newRt = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Rt.create(newRt, function(err, rt) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save rt
                                    rt.save();
                                    foundAllocator.rt.push(rt);
                                    foundAllocator.save();
                                    allocatedRt++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - rt;
                    console.log(rt + " Rt colleague has been allocated!");
                    console.log(rtCount);
                    //************************
                    //*  RT ALLOCATION ENDS  *
                    //************************
                    //**********************
                    //CSC ALLOCATION STARTS*
                    //**********************
                    foundColleague.forEach(function(colleague) {
                        if (cscCount != csc) { //
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].csc == true) { //
                                if (colleague.rating[0].csc >= minimumRate) { //
                                    var cscColleague = colleague.firstName + " " + colleague.lastName;
                                    cscCount++;
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    cscC.push(cscColleague); //
                                }
                            }
                        }
                    });
                    console.log(cscC + "(Will be in the tower.)");
                    //csc allocation
                    cscC.forEach(function(foundCsc) {
                        var text = "";
                        text = foundCsc;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newCsc = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Csc.create(newCsc, function(err, csc) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(csc);
                                foundAllocator.csc.push(csc);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedCsc++;
                            }
                        });
                    });
                    if (allocatedCsc < csc) {
                        cscC = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (cscCount - csc < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].csc == true) {
                                    if (colleague.rating[0].csc >= minimumRate) {
                                        var csc = colleague.firstName + " " + colleague.lastName;
                                        cscCount = csc;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        cscC.push(csc);
                                    }
                                }
                            }
                        });
                        cscC.forEach(function(foundCsc) {
                            var text = "";
                            text = foundCsc;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newCsc = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Csc.create(newCsc, function(err, csc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save csc
                                    csc.save();
                                    foundAllocator.csc.push(csc);
                                    foundAllocator.save();
                                    allocatedCsc++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - csc;
                    console.log(csc + " Csc colleague has been allocated!");
                    console.log(cscCount);
                    //************************
                    //*  CSC ALLOCATION ENDS *
                    //************************
                    //*************************
                    //RUNNER ALLOCATION STARTS*
                    //*************************
                    minimumRate = 1;
                    foundColleague.forEach(function(colleague) {
                        if (runnerCount != runner) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].runner == true) {
                                if (colleague.rating[0].tip >= minimumRate) {
                                    var runnerColleague = colleague.firstName + " " + colleague.lastName;
                                    runnerCount++;
                                    console.log(runnerCount);
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    runnerC.push(runnerColleague);
                                }
                            }
                        }
                    });
                    console.log(runnerC + "(Will be the runner Colleague)");
                    //runner allocation
                    runnerC.forEach(function(foundRunner) {
                        var text = "";
                        text = foundRunner;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newRunner = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Runner.create(newRunner, function(err, runner) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(runner);
                                foundAllocator.runner.push(runner);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedRunner++;
                            }
                        });
                    });
                    if (allocatedRunner < runner) {
                        runnerC = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (runnerCount - runner < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].runner == true) {
                                    if (colleague.rating[0].tip >= minimumRate) {
                                        var runner = colleague.firstName + " " + colleague.lastName;
                                        runnerCount = runner;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        runnerC.push(runner);
                                    }
                                }
                            }
                        });
                        runnerC.forEach(function(foundRunner) {
                            var text = "";
                            text = foundRunner;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newRunner = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Runner.create(newRunner, function(err, runner) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save driver
                                    runner.save();
                                    /// Driver.find?? push driver.id?
                                    foundAllocator.runner.push(runner);
                                    foundAllocator.save();
                                    allocatedRunner++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - runner;
                    console.log(runner + " Runner colleague has been allocated!");
                    console.log(runnerCount);
                    // **********************
                    //RUNNER ALLOCATION ENDS*
                    // **********************
                    //**********************
                    //TIPPERS ALLOCATION STARTS*
                    //**********************
                    minimumRate = 10;
                    foundColleague.forEach(function(colleague) {
                        if (tipCount != tipMen) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].tip == true) {
                                if (colleague.rating[0].tip >= minimumRate) {
                                    var tipper = colleague.firstName + " " + colleague.lastName;
                                    tipCount++;
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    tippers.push(tipper);
                                }
                            }
                        }
                    });
                    console.log(tippers + "(Will be tipping.)");
                    //tipper allocation
                    tippers.forEach(function(foundTipper) {
                        var text = "";
                        text = foundTipper;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newTipper = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Tipper.create(newTipper, function(err, tipper) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(tipper);
                                foundAllocator.tip.push(tipper);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedTipper++;
                            }
                        });
                    });
                    if (allocatedTipper < tipMen) {
                        tippers = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (tipCount - tipMen < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].tip == true) {
                                    if (colleague.rating[0].tip >= minimumRate) {
                                        var tipper = colleague.firstName + " " + colleague.lastName;
                                        tipCount++;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        tippers.push(tipper);
                                    }
                                }
                            }
                        });
                        tippers.forEach(function(foundTipper) {
                            var text = "";
                            text = foundTipper;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newTipper = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Tipper.create(newTipper, function(err, tipper) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save tipper
                                    tipper.save();
                                    foundAllocator.tip.push(tipper);
                                    foundAllocator.save();
                                    allocatedTipper++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - tipMen;
                    console.log(tipMen + " Tippers colleagues have been allocated!");
                    console.log(tipCount);
                    //************************
                    //TIPPERS ALLOCATION ENDS*
                    //************************
                    //***************************
                    // DRIVERS ALLOCATION STARTS*
                    //***************************
                    if (truckDriver > driverCount) {
                        console.log("Allocation done.");
                    }
                    minimumRate = 8;
                    foundColleague.forEach(function(colleague) {
                        if (driverCount != truckDriver) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].trucks == true) {
                                if (colleague.rating[0].trucks >= minimumRate) {
                                    var driver = colleague.firstName + " " + colleague.lastName;
                                    driverCount++;
                                    console.log(driverCount);
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    drivers.push(driver);
                                }
                            }
                        }
                    });
                    console.log(drivers);
                    //drivers allocation
                    drivers.forEach(function(foundDriver) {
                        var text = "";
                        text = foundDriver;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = ""; //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newDriver = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Driver.create(newDriver, function(err, driver) {
                            if (err) {
                                console.log(err);
                            } else {
                                //save driver
                                // driver.save();
                                console.log(driver);
                                foundAllocator.trucks.push(driver);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedDriver++;
                            }
                        });
                    });
                    if (allocatedDriver < truckDriver) {
                        drivers = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (driverCount - truckDriver < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].trucks == true) {
                                    if (colleague.rating[0].trucks >= minimumRate) {
                                        var driver = colleague.firstName + " " + colleague.lastName;
                                        driverCount++;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        drivers.push(driver);
                                    }
                                }
                            }
                        });
                        drivers.forEach(function(foundDriver) {
                            var text = "";
                            text = foundDriver;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newDriver = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Driver.create(newDriver, function(err, driver) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save driver
                                    driver.save();
                                    /// Driver.find?? push driver.id?
                                    foundAllocator.trucks.push(driver);
                                    foundAllocator.save();
                                    allocatedDriver++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - truckDriver;
                    console.log(truckDriver + " Drivers has been allocated!");
                    console.log(driverCount);
                    //**************************************************************
                    //                      DRIVERS ALLOCATION FINISHED            *
                    //**************************************************************
                    //***************************
                    // LOADERS ALLOCATION STARTS*
                    //***************************
                    if (loader > loaderCount) {
                        console.log("Allocation done.");
                    }
                    minimumRate = 8;
                    foundColleague.forEach(function(colleague) {
                        if (loaderCount != loader) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].loading == true) {
                                if (colleague.rating[0].loading >= minimumRate) {
                                    var loader = colleague.firstName + " " + colleague.lastName;
                                    loaderCount++;
                                    console.log(loaderCount);
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    loaders.push(loader);
                                }
                            }
                        }
                    });
                    console.log(loaders);
                    //loaders allocation
                    loaders.forEach(function(foundLoader) {
                        var text = "";
                        text = foundLoader;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newLoader = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Loader.create(newLoader, function(err, loader) {
                            if (err) {
                                console.log(err);
                            } else {
                                //save loader
                                // loader.save();
                                console.log(loader);
                                foundAllocator.loading.push(loader);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedLoader++;
                            }
                        });
                    });
                    if (allocatedLoader < loader) {
                        loaders = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (loaderCount - loader < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].loading == true) {
                                    if (colleague.rating[0].loading >= minimumRate) {
                                        var loader = colleague.firstName + " " + colleague.lastName;
                                        loaderCount++;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        loaders.push(loader);
                                    }
                                }
                            }
                        });
                        loaders.forEach(function(foundLoader) {
                            var text = "";
                            text = foundLoader;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newLoader = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Loader.create(newLoader, function(err, loader) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save loader
                                    loader.save();
                                    /// Loader.find?? push loader.id?
                                    foundAllocator.loading.push(loader);
                                    foundAllocator.save();
                                    allocatedLoader++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - loader;
                    console.log(loader + " Loaders has been allocated!");
                    console.log(loaderCount);
                    //**************************************************************
                    //                      LOADERS ALLOCATION FINISHED            *
                    //**************************************************************
                    //***************************
                    // PICKERS ALLOCATION STARTS*
                    //***************************
                    if (pickMen >= pickerCount) {
                        console.log("Allocation done.");
                    }
                    minimumRate = 8;
                    foundColleague.forEach(function(colleague) {
                        if (pickerCount != pickMen) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].pick == true) {
                                if (colleague.rating[0].pick >= minimumRate) {
                                    var picker = colleague.firstName + " " + colleague.lastName;
                                    pickerCount++;
                                    console.log(pickerCount);
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    pickers.push(picker);
                                }
                            }
                        }
                    });
                    console.log(pickers);
                    //pickers allocation
                    pickers.forEach(function(foundPicker) {
                        var text = "";
                        text = foundPicker;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newPicker = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Picker.create(newPicker, function(err, picker) {
                            if (err) {
                                console.log(err);
                            } else {
                                //save picker
                                // picker.save();
                                console.log(picker);
                                foundAllocator.pickers.push(picker);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedPicker++;
                            }
                        });
                    });
                    if (allocatedPicker < pickMen) {
                        pickers = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (pickerCount - pickMen < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].pick == true) {
                                    if (colleague.rating[0].pick >= minimumRate) {
                                        var picker = colleague.firstName + " " + colleague.lastName;
                                        pickerCount++;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        pickers.push(picker);
                                    }
                                }
                            }
                        });
                        pickers.forEach(function(foundPicker) {
                            var text = "";
                            text = foundPicker;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newPicker = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Picker.create(newPicker, function(err, picker) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save picker
                                    picker.save();
                                    /// Picker.find?? push picker.id?
                                    foundAllocator.pickers.push(picker);
                                    foundAllocator.save();
                                    allocatedPicker++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - pickMen;
                    console.log(pickMen + " Pickers has been allocated!");
                    console.log(pickerCount);
                    //**************************************************************
                    //                      PICKERS ALLOCATION FINISHED            *
                    //**************************************************************
                    //****************************
                    // CHUTEMEN ALLOCATION STARTS*
                    //****************************
                    minimumRate = 1;
                    chuteMen = bCount;
                    foundColleague.forEach(function(colleague) {
                        if (chuterCount != chuteMen) {
                            if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].chutes == true) {
                                if (colleague.rating[0].chutes >= minimumRate) {
                                    var chuter = colleague.firstName + " " + colleague.lastName;
                                    chuterCount++;
                                    console.log(chuterCount);
                                    colleague.isAllocated = true;
                                    colleague.save();
                                    chutes.push(chuter);
                                }
                            }
                        }
                    });
                    console.log(chutes);
                    //chutes allocation
                    chutes.forEach(function(foundChute) {
                        var text = "";
                        text = foundChute;
                        console.log(text);
                        var author = {
                            id: foundAllocator.id
                        };
                        var colleagueId = "" //new
                        foundColleague.forEach(function(colleague) { //new
                            if (text === colleague.fullName) { //new
                                colleagueId = colleague.id //new
                                text = text //new
                            } //new
                        }); //new
                        var newChute = {
                            text: text,
                            author: author,
                            colleagueId: colleagueId //new
                        };
                        Chute.create(newChute, function(err, chuter) {
                            if (err) {
                                console.log(err);
                            } else {
                                //save chuter
                                chuter.save();
                                console.log(chuter);
                                foundAllocator.chutes.push(chuter);
                                // foundAllocator.isAllocated = true; //kesobb!!!
                                foundAllocator.save();
                                allocatedChute++;
                            }
                        });
                    });
                    if (allocatedChute < chuteMen) {
                        chutes = [];
                        minimumRate = getRandomInt(minimumRate - 1);
                        foundColleague.forEach(function(colleague) {
                            if (chuterCount - chuteMen < 0) {
                                if (colleague.isAllocated == false && colleague.isIn == true && colleague.roles[0].chutes == true) {
                                    if (colleague.rating[0].chutes >= minimumRate) {
                                        var chuter = colleague.firstName + " " + colleague.lastName;
                                        chuterCount++;
                                        colleague.isAllocated = true;
                                        colleague.save();
                                        chutes.push(chuter);
                                    }
                                }
                            }
                        });
                        chutes.forEach(function(foundChute) {
                            var text = "";
                            text = foundChute;
                            console.log(text);
                            var author = {
                                id: foundAllocator.id
                            };
                            var colleagueId = "" //new
                            foundColleague.forEach(function(colleague) { //new
                                if (text === colleague.fullName) { //new
                                    colleagueId = colleague.id //new
                                    text = text //new
                                } //new
                            }); //new
                            var newChute = {
                                text: text,
                                author: author,
                                colleagueId: colleagueId //new
                            };
                            Chute.create(newChute, function(err, chuter) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //save chuter
                                    chuter.save();
                                    /// Chute.find?? push chuter.id?
                                    foundAllocator.chutes.push(chuter);
                                    foundAllocator.save(); //???
                                    allocatedChute++;
                                }
                            });
                        });
                    }
                    // res.redirect("/allocationshow/" + req.params.id);
                    minimumRate = 8;
                    bCount = bCount - chuteMen;
                    console.log(chuteMen + " Chutes has been allocated!");
                    console.log(chuterCount);
                    //**************************************************************
                    //                     CHUTEMEN ALLOCATION FINISHED            *
                    //**************************************************************
                    console.log(bCount + " Colleagues remaining for allocation in the database");
                    res.redirect("back"); //lehet hogy + req.params.id nem kell!!!
                }
            });
        }
    });
});
//
// DELETE ALLOCATOR ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req, res) {
    //destroy blog
    Allocator.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/allocator/allocations");
        } else {
            res.redirect("/allocator/allocations");
        }
    });
    //redirect somewhere
});
//Driver DESTROY
router.delete("/:id/drivershow/:driver_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Driver.findByIdAndRemove(req.params.driver_id, function(err, deletedDriver) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedDriver.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/drivershow");
                }
            });
        }
    });
});
//Picker DESTROY
router.delete("/:id/pickershow/:picker_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Picker.findByIdAndRemove(req.params.picker_id, function(err, deletedPicker) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedPicker.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/pickershow");
                }
            });
        }
    });
});
//Chute DESTROY
router.delete("/:id/chuteshow/:chute_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Chute.findByIdAndRemove(req.params.chute_id, function(err, deletedChute) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedChute.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/chuteshow");
                }
            });
        }
    });
});
//Rt DESTROY
router.delete("/:id/rtshow/:rt_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Rt.findByIdAndRemove(req.params.rt_id, function(err, deletedRt) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedRt.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/rtshow");
                }
            });
        }
    });
});
//Tipper DESTROY
router.delete("/:id/tippershow/:tipper_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Tipper.findByIdAndRemove(req.params.tipper_id, function(err, deletedTipper) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedTipper.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/tippershow");
                }
            });
        }
    });
});
//Runner DESTROY
router.delete("/:id/runnershow/:runner_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Runner.findByIdAndRemove(req.params.runner_id, function(err, deletedRunner) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedRunner.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/runnershow");
                }
            });
        }
    });
});
//Mts DESTROY
router.delete("/:id/mtsshow/:mts_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Mts.findByIdAndRemove(req.params.mts_id, function(err, deletedMts) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedMts.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/mtsshow");
                }
            });
        }
    });
});
//Rb DESTROY
router.delete("/:id/rbshow/:rb_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Rb.findByIdAndRemove(req.params.rb_id, function(err, deletedRb) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        console.log(deletedRb);
                        if (colleague.id === deletedRb.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/rbshow");
                }
            });
        }
    });
});
//Csc DESTROY
router.delete("/:id/cscshow/:csc_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Csc.findByIdAndRemove(req.params.csc_id, function(err, deletedCsc) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedCsc.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/cscshow");
                }
            });
        }
    });
});
//Hygiene DESTROY
router.delete("/:id/hygieneshow/:hygiene_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Hygiene.findByIdAndRemove(req.params.hygiene_id, function(err, deletedHygiene) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedHygiene.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/hygieneshow");
                }
            });
        }
    });
});
//Baler DESTROY
router.delete("/:id/balershow/:baler_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Baler.findByIdAndRemove(req.params.baler_id, function(err, deletedBaler) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedBaler.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/balershow");
                }
            });
        }
    });
});
//Loader DESTROY
router.delete("/:id/loadershow/:loader_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Loader.findByIdAndRemove(req.params.loader_id, function(err, deletedLoader) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedLoader.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/loadershow");
                }
            });
        }
    });
});
//Yard DESTROY
router.delete("/:id/yardshow/:yard_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Yard.findByIdAndRemove(req.params.yard_id, function(err, deletedYard) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedYard.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/yardshow");
                }
            });
        }
    });
});
//Racking DESTROY
router.delete("/:id/rackingshow/:racking_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Racking.findByIdAndRemove(req.params.racking_id, function(err, deletedRacking) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedRacking.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/rackingshow");
                }
            });
        }
    });
});
//Manualpick DESTROY
router.delete("/:id/manualpickshow/:manualpick_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            ManualPick.findByIdAndRemove(req.params.manualpick_id, function(err, deletedManualpick) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedManualpick.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/manualpickshow");
                }
            });
        }
    });
});
//Training DESTROY
router.delete("/:id/trainingshow/:training_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Training.findByIdAndRemove(req.params.training_id, function(err, deletedTraining) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedTraining.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/trainingshow");
                }
            });
        }
    });
});
//Union DESTROY
router.delete("/:id/unionshow/:union_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Union.findByIdAndRemove(req.params.union_id, function(err, deletedUnion) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedUnion.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/unionshow");
                }
            });
        }
    });
});
//Vls DESTROY
router.delete("/:id/vlsshow/:vls_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Vls.findByIdAndRemove(req.params.vls_id, function(err, deletedVls) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedVls.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/vlsshow");
                }
            });
        }
    });
});
//Pickmanager DESTROY
router.delete("/:id/pickmanagershow/:pickmanager_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Pickmanager.findByIdAndRemove(req.params.pickmanager_id, function(err, deletedPickmanager) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedPickmanager.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/pickmanagershow");
                }
            });
        }
    });
});
//Chutemanager DESTROY
router.delete("/:id/chutemanagershow/:chutemanager_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Chutemanager.findByIdAndRemove(req.params.chutemanager_id, function(err, deletedChutemanager) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedChutemanager.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/chutemanagershow");
                }
            });
        }
    });
});
//Truckmanager DESTROY
router.delete("/:id/truckmanagershow/:truckmanager_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Truckmanager.findByIdAndRemove(req.params.truckmanager_id, function(err, deletedTruckmanager) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedTruckmanager.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/truckmanagershow");
                }
            });
        }
    });
});
//Office DESTROY
router.delete("/:id/officeshow/:office_id", middleware.isLoggedIn, function(req, res) {
    //fyndByIdAndRemove
    Colleague.find({}, function(err, foundColleague) {
        if (err) {
            console.log(err);
        } else {
            Office.findByIdAndRemove(req.params.office_id, function(err, deletedOffice) {
                if (err) {
                    req.flash("error", "hasn't deleted...")
                    res.redirect("back");
                } else {
                    foundColleague.forEach(function(colleague) {
                        if (colleague.id === deletedOffice.colleagueId) {
                            colleague.isAllocated = false;
                            colleague.allocatedLeader = false;
                            colleague.save();
                        }
                    });
                    res.redirect("/allocator/" + req.params.id + "/officeshow");
                }
            });
        }
    });
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
module.exports = router;