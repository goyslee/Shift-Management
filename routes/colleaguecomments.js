var express = require("express");
var router = express.Router({mergeParams: true});
var Colleague = require("../models/colleague");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //use middleware. for calling middlewares

//=========================================
//COMMENTS ROUTES
//=========================================
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Colleague.findById(req.params.id, function(err, colleague){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/colleagueComment", {colleague: colleague});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup colleague using ID
    Colleague.findById(req.params.id, function(err, colleague){
        if(err){
            console.log(err);
            res.redirect("/colleagues");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    colleague.comments.push(comment);
                    colleague.save();
                    // console.log(comment.author.username);
                    res.redirect('/colleagues/' + colleague._id);
                }
            });//pass req.body.comment instead of an object LECTURE 279 video 2:20 to
        }
    });
});
//comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // res.send("Most mivan?");
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {colleague_id: req.params.id, comment: foundComment});
        }
    });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/colleagues/" + req.params.id);
        }
    });
});

//COMMENT DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //fyndByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/colleagues/" + req.params.id);
        }
    });
});

module.exports = router;
