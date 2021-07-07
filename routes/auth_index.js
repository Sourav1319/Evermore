var express=require("express")
var router=express.Router()
var passport=require("passport")
var User=require("../models/user")


router.get("/",function(req,res){
	res.redirect('/books');
})

//register
router.get("/register",function(req,res){
	res.render("register")
})
router.post("/register",function(req,res)
		{
			User.register(new User({username:req.body.username}),req.body.password,function(err,user){
					if(err){
						console.log(err)
						req.flash("error",err.message)
						res.redirect("/register")
					}
					else{
						passport.authenticate("local")(req,res,function(){
							req.flash("success","Welcome "+req.body.username+".")
							res.redirect("/books")
						})
					}
			})
		})


//login
router.get("/login",function(req,res){
	res.render("login")
})

router.post("/login",passport.authenticate("local",{
	successRedirect:"/books",
	failureRedirect:"/login"
}),function(req,res){

})

//logout

router.get("/logout",function(req,res){
	req.logout(),
	req.flash("success","you are logged out")
	res.redirect("/books")
})

//adding the middleware

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect("/login")
}

module.exports=router;