const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐Register
router.post("/register",async (req,res) => {
    try{
        const {email,password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new User({email,password: hashedPassword});
        await user.save();
        res.json({message: "User Registered successfully"});
    }catch (error){
        res.status(500).json({message: error.message});
    }
});

// 🔐Login
router.post("/login",async(req,res) => {
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );
        res.json({user,token});
        res.json({message: "Login successfull",token,user});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

module.exports = router;