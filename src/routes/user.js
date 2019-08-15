const express=require("express")
const jwt=require("jsonwebtoken")
const sharp=require("sharp")
const multer=require("multer")
const {sendWelcomeEmail,sendRemoveEmail}= require("../emails/account")
const User=require("../modules/user")
const auth=require("../middleware/auth")

const router=new express.Router()

const upload=multer({
    
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb( new Error('please upload imge only'))
            
        }
        cb(undefined,true)
    }
})
  
router.get("/user/me",auth,async(req,res)=>{
    res.status(200).send(req.user)
})


router.post("/user/me/avatar",auth,upload.single("avatar"),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send(req.user)
},(err,req,res,next)=>{
    res.status(400).send({err:err.message})
})
router.delete("/user/me/avatar",auth,async(req,res)=>{
     req.user.avatar=undefined
     await req.user.save()
    res.send()
})

router.post("/user",async (req,res)=>{
    const user= new User(req.body)
    
    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token=await user.tokenAuth()
     res.status(201).send({user,token})
    } catch(e){
      res.status(400).send(e)
    }

})
router.post("/user/login",async(req,res)=>{
    try{
    const user=await User.findByCredentials(req.body.email,req.body.password)
    const token=await user.tokenAuth()
    res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})
router.post("/user/logout",auth,async(req,res)=>{
  try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
  }catch(e){
      res.status(500).send(e)

  }
})
router.post("/user/logoutall",auth,async(req,res)=>{
    try{
         req.user.tokens=[]
          await req.user.save()
          res.status(200).send()
    }catch(e){
        res.status(500).send(e)
  
    }
  })





router.patch("/user/me",auth,async(req,res)=>{
    // const userup= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    const updates=Object.keys(req.body)
    try{
       
        updates.forEach((update) => {
           req.user[update]=req.body[update]
            
        });
        await req.user.save()
     
     
      res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
router.delete("/user/me",auth,async(req,res)=>{
    try{
       await req.user.remove()
       sendRemoveEmail(req.user.email,req.user.name)
        res.send(req.user)
     
    }catch(e){
        res.status(404).send(e)
    }
})
router.get("/user/:id/avatar",async(req,res)=>{
    try{
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
        throw new Error("user not found");
        
    }
    res.set("Content-Type","image/png")
    res.send(user.avatar)
}catch(e){
    res.status(404).send(e)
}
})
module.exports=router

