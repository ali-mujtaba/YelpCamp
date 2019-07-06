var mongoose = require('mongoose');
var Campground = require('./models/campground.js');
var Comment = require('./models/comment.js');

var data = [
        {
            name: "Cloud's Rest",
            image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            name: "Desert Mesa",
            image: "https://farm3.staticflickr.com/2116/2164766085_0229ac3f08.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            name: "Canyon Floor",
            image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
    ]

var com = {
    text: "I wish this place had internet.",
    author: "Developer"
};
function seedDB(){
    Campground.remove({},function(err){
        if(err)
        console.log(err);
        else {
            console.log("Removed Campgrounds!");
            Comment.remove({},function(err){
                if(err)
                console.log(err);
                else{
                    console.log("Removed Comments");
                    Campground.create(data,function(err,campgrounds){
                        if(err)
                        console.log(err);
                        else{
                            console.log("Added campground(s)")
                            campgrounds.forEach(function(campground){
                                Comment.create(com,function(err,createdComment){
                                    if(err)
                                    console.log(err);
                                    else{
                                        campground.comments.push(createdComment);
                                        campground.save();
                                        console.log("Added comment");
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
}

module.exports = seedDB;
