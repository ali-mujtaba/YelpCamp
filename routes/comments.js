// ================================
// COMMENTS ROUTES
// ================================
var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
// NEW
router.get("/new",middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found!");
            res.redirect("back");
        }
        else{
            // console.log(foundCampground);
            res.render("comments/new",{campground:foundCampground});

        }
    });
});

// CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);            
            req.flash("error","Campground not found!");
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,function(err,newComment){
                if(err)
                console.log(err);
                else{
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save(function(err){
                        if(err)
                        console.log(err);
                        else{
                            req.flash("success","Comment added!");
                            res.redirect("/campgrounds/"+req.params.id);
                        }
                    });
                }
            });

        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
            res.redirect("back");
        else
            res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});
    })
})

router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err)
            res.redirect("back");
        else
            req.flash("success","Comment updated!");
            res.redirect("/campgrounds/"+req.params.id);
    })
})

router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect("back");
        else{
            req.flash("success","Comment added!");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;
