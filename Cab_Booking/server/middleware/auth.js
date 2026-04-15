const jwt = require("jsonwebtoken");
module.exports = (req,res,next)=> {
    try{
        console.log("HEADER 👉",req.headers.authorization);
        const token = req.headers.authorization ?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "No token"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.log("AUTH ERROR ❌",error.message);
        res.status(401).json({message: "Invalid token"});
    }
};