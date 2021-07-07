var express=require("express")
var router=express.Router({mergeParams:true})
var campground=require("../models/campgrounds")
var middleware=require("../middleware/index")


//looping through and displaying the campgrounds
router.get("/",function(req,res){
	campground.find({},function(err,campground){
		if(err){
			console.log("error")
		}
		else{
			console.log("server said chill")
			res.render("campgrounds/index",{campgrounds:campground})
		}
	});

})
router.post("/",middleware.isloggedin,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampground={name:name,image:image,description:description,author:author}
	campground.create(newcampground,function(err,campground){
		if(err){
			req.flash("error",err.message)
			console.log("error")
		}
		else{	
				req.flash("success","Item is successfully added to the list")
				res.redirect("/")
	         }
	});

})

//adding new campgrounds
router.get("/new",middleware.isloggedin,function(req,res){
	res.render("campgrounds/new");
})
router.get("/:id",function(req,res){
	//get the elements by id
	//past it to show.ejs
	campground.findById(req.params.id).populate("comments").exec(function(err,showcampground){
		if(err){
			req.flash("error",err.message)
			console.log(err)
		}
		else{
			res.render("campgrounds/shows",{campground:showcampground});
		}
	})

})

//editing campgrounds
router.get("/:id/edit",middleware.isloggedin,middleware.checkcampgroundauth,function(req,res){
		campground.findById(req.params.id,function(err,campground){
			if(err){
				req.flash("error",err.message)
				return ("back")
			}
			else{
				res.render("campgrounds/edit",{campground:campground})
			}
		})
})

router.put("/:id",middleware.isloggedin,middleware.checkcampgroundauth,function(req,res){
	campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,editedcampground){
		if(err){
			req.flash("error",err.message)
			console.log(err)
		}
		else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})
//deleting campgrounds

router.delete("/:id",middleware.isloggedin,middleware.checkcampgroundauth,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err)
			req.flash("error",err.message)
			res.redirect("/")
		}
		else{
			req.flash("success","Campground successfully deleted")
			res.redirect("/")
		}
	})
})



module.exports=router;