const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require("bcrypt");
const DoctorSchema= require("../Scheema/DoctorScheema")
const jwt = require("jsonwebtoken");
const Doctor = new mongoose.model("Singupdoctors",DoctorSchema);
const CheakLoginControler = require('../MiddleWears/CheakLoginControler')
const saltRounds = 10;
router.post("/login",async(req,res)=>{
    try {
       const user = await Doctor.find({ username: req.body.username });
       if (user&&user.length>0) {
             const isvalidPassword=  await bcrypt.compare(req.body.password, user[0].password);
            
             if(isvalidPassword) {
                 // generate token
 
                 const token = jwt.sign({
                     username: user[0].username,
                    
                     userId: user[0]._id,
                 }, process.env.JWT_SECRET, {
                     expiresIn: '1h'
                 });
 
                 res.status(200).json({
                     "access_token": token,
                     "message": "Login successful!"
                 });
             } else {
                 res.status(200).json({
                     "error": "Wrong Username and password"
                 });
             }
         } else {
             res.status(200).json({
                 "error": "Wrong Username and password"
             });
       }
    } catch (error) {
     res.status(200).json({
         "error": "Wrong Username and password"
     });
    }  
 })
 
 router.get("/DocProfile",CheakLoginControler,async(req,res)=>{
    try {  
        const user = await Doctor.find({ username: req.query.username  });
        if(user&&user.length>0){
            res.send(user)
        }
        
    } catch (error) {
        res.status(200).json({
            "error": "Wrong Username and password"
        }); 
    }
  
     
 })



 module.exports = router;