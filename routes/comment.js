var express=require("express")
var router=express.Router({mergeParams:true})
var campground=require("../models/campgrounds")
var comment=require("../models/comments")
var User=require("../models/user")
var middleware=require("../middleware/index")


//adding new comment
router.get("/new",middleware.isloggedin,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error",err.message)
			console.log(err)
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	})
	
})

router.post("/",middleware.isloggedin,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
			req.flash("error",err.message)
			res.redirect("/campgrounds")
		}
		else{
			comment.create(req.body.comment,function(err,newcomment){
				if(err){
					req.flash("error",err.message)
					console.log(err)
				}
				else{

						
						newcomment.author.id=req.user._id;
						newcomment.author.username=req.user.username;
						newcomment.save();
						campground.comments.push(newcomment)
						campground.save();
						res.redirect("/campgrounds/"+req.params.id)
				
					
						
					}
					
				
			})
		}
	})
})

router.get("/:comment_id/edit",middleware.isloggedin,middleware.checkcommentauth,function(req,res){
		comment.findById(req.params.comment_id,function(err,editedcomment){
			if(err){
				req.flash("error",err.message)
				res.redirect("back")
			}
			else{
				res.render("comments/edit",{campground_id:req.params.id,comment:editedcomment})
			}
		})
})
router.put("/:comment_id",middleware.isloggedin,middleware.checkcommentauth,function(req,res){
	comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
			if(err){
				req.flash("error",err.message)
				res.redirect("back")
			}
			else{
				res.redirect("/campgrounds/"+req.params.id)
			}
	})
})

router.delete("/:comment_id",function(req,res){
	comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error",err.message)
			res.redirect("back")
		}
		else{
			req.flash("succcess","Comment successfully deleted")
			res.redirect("/campgrounds/"+req.params.id)
		}
	})

})

module.exports=router;




