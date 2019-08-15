const express=require("express")
const router=new express.Router()
const Task=require("../modules/task")
const auth=require("../middleware/auth")


router.get("/task",auth,async(req,res)=>{
  const match={}
  const sort={}
  if(req.query.complet){
      match.complet=req.query.complet==="true"
  }
  if(req.query.sortBy){
      const parts=req.query.sortBy.split(":")
      sort[parts[0]]=parts[1]==="desc"? -1:1
  }
  
    try{
         await req.user.populate({
             path:'task',
             match,
             options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
             }
             
         }).execPopulate()
        
        res.status(200).send(req.user.task)
    }catch(e){
        res.status(400).send(e)
    }
    
})
router.get("/task/:id",auth,async(req,res)=>{
    const _id=req.params.id
    try{
        const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send("no task found")
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
   
})

router.post("/task",auth,async (req,res)=>{
    const task= new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(404).send(e)
    }
   
   
   
})
router.patch("/task/:id",auth,async(req,res)=>{
   const updates=Object.keys(req.body)
   const allowupdate=["description","complet"]
   const isvalid=updates.every((update)=> allowupdate.includes(update))
   if(!isvalid){
       return res.status(400).send("this is not an option")
   }
   
   
    try{
      
        const taskupdate=await Task.findOne({_id:req.params.id,owner:req.user._id})
       
       
        if(!taskupdate){
            res.status(404).send("no task found")
        }
        updates.forEach((update)=>{
            taskupdate[update]=req.body[update]
        })
        await taskupdate.save()
        res.send(taskupdate)
    }catch(e){
    res.status(500).send(e)
    }
})
router.delete("/task/:id",auth,async(req,res)=>{
    try{
        const taskde=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!taskde){
            return res.status(404).send("there is no user")
         }
        res.status(200).send(taskde)
    }catch(e){
        res.status(404).send(e)
    }
})
module.exports=router