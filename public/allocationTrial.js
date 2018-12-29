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