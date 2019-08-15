const jwt=require("jsonwebtoken")
const User=require("../modules/user")

const auth=async(req,res,next)=>{
    
    try{
        const token=req.header("Authorization").replace("Bearer ", "")
        
        const decoded=jwt.verify(token,"anything")
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})
        if(!user){
            
            throw new Error("error please auth")
        }
    req.token=token    
    req.user=user
     next()
    }catch(e){
        
        
          res.send(e)
    }
    
}
module.exports=auth