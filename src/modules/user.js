const mongoose=require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const Task=require("./task")

const UserSchema= new mongoose.Schema({
    name:{
        type:String
    }
    ,age:{
        type:Number
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("email is invalde")
            }
         

            }
         
        },
        password:{
            type:String,
            required:true,
            tirm:true,
            validate(value){
                const word="password"
            if(value.length<=6 ||value.includes(word)){
                   throw new Error("password to week")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
      
    }],avatar:{
        type:Buffer
    }

},{
    toJSON: { virtuals: true },
    timestamps:true
})
UserSchema.virtual('task',{
    ref:'task',
    localField:'_id',
    foreignField:'owner'
})

UserSchema.methods.toJSON=  function(){
    const user=this
    const userObject=user.toObject()

     
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}




UserSchema.methods.tokenAuth=async function(){
    const user= this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}
UserSchema.statics.findByCredentials= async (email,password)=>{
          const user=await User.findOne({email})

          if(!user){
              throw new Error("Unable to login");
              
          }
          const isMatch=await bcrypt.compare(password,user.password)
          if(!isMatch){
              throw new Error("Unable to login")
          }
          return user
}



// hasing passowrd
UserSchema.pre("save",async function(next){
    const user =this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

UserSchema.pre("remove",async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User= mongoose.model("User",UserSchema)
module.exports=User