// const router = require("express").Router();
// const passport = require("passport");
// const { Profiler } = require("react");

// // router.get(
// //     "/google/callback",
// //     passport.authenticate("google",{
// //         successRedirect: process.env.CLIENT_ID,
// //         failureRedirect:"/login/failed",
// //     })
// // );
// // router.get("/login/failed",(req,res)=>{
// //     res.status(401).json({
// //         error:true,
// //         message:"Login failed"
// //     });
// // });

// router.get("/login/success",(req,res)=>{
//     if(req.user){
//         res.status(200).json({
//         error:false,
//         message:"Successfully Loged in",
//         user:req.user
//     });
//     }else{
//         res.status(403).json({error:true,message:"Not Authorized"});
//     }
// });

// router.get("/google",passport.authenticate("google",["Profile","email"]));

// router.get("/logout",(req,res)=>{
//     req.logOut();
//     res.redirect(process.env.CLIENT_ID);  
// });

// module.exports = router; 