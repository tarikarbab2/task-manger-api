const express=require("express")
const app=express()
require("./mongoose/mongoose.js")
const port=process.env.PORT 
const userroute=require("./routes/user")
const taskroute=require("./routes/task")




app.use(express.json())
app.use(userroute)
app.use(taskroute)


app.listen(3000,(req,res)=>{
    console.log("the server has started on port "+port)
})