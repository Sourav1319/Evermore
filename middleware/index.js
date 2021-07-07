var campground=require("../models/campgrounds")
var comment   =require("../models/comments")
var middlewareObj={};

middlewareObj.checkcampgroundauth=function(req,res,next){
		campground.findById(req.params.id,function(err,campground){
			if(err){
				req.flash("error",err.message)
				res.redirect("/")
			}
			else{
				if(campground.author.id.equals(req.user._id)){
				return next();
				}
				req.flash("error","You do not have permission to do that")
				res.redirect("back")
			}
			

		})
	}

middlewareObj.checkcommentauth=function(req,res,next){
	comment.findById(req.params.comment_id,function(err,ncomment){
		if(err){
			req.flash("error",err.message)
			res.redirect("/")
		}
		else{
			if(ncomment.author.id.equals(req.user._id)){
			return next();
			}
			req.flash("error","You do not have permission to do that..")
			res.redirect("back")
		}
	})
}

middlewareObj.isloggedin=function(req,res,next){

	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to that")
	res.redirect("/login")
}

module.exports=middlewareObj;