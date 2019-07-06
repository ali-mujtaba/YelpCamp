var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// INDEX
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
        console.log(err);
        else
        res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
});

// NEW
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("campgrounds/new");
});

// CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    console.log(req.body);
    Campground.create(req.body,function(err,newlyCreated){
        if(err)
        console.log(err);
        else{
            newlyCreated.author.id=req.user.id;
            newlyCreated.author.username=req.user.username;
            newlyCreated.save();
            console.log("Added Campground: "+newlyCreated);

        }
        res.redirect("/campgrounds");
    });
});

// SHOW
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found!");
            res.redirect("back");
        }
        else{
            // console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });
});

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("./campgrounds/edit",{campground:foundCampground});
    });
});
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect("/campgrounds/"+req.params.id);
    })
})

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err,campgroundRemoved){
        if(err)
            res.redirect("/campgrounds");
        else {
            Comment.deleteMany({_id: { $in: campgroundRemoved.comments}},function(err){
                res.redirect("/campgrounds");    
            });
        }
    });
});

module.exports = router;
