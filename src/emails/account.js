const sgMail=require("@sendgrid/mail")



sgMail.setApiKey(process.env.SEND_GRID_API)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'tarikarbab4@gmail.com',
        subject:'thanks for joining in',
        text:`hello ${name} this is a welcome massege`
    })
}
const sendRemoveEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'tarikarbab4@gmail.com',
        subject:'about removeing your account',
        text:`hello ${name} we are very sorry that our service didnt like you and we will work to improve our survice so can you please help us and tell us what are the resons and have a good time`

    })
}


module.exports={
    sendWelcomeEmail,
    sendRemoveEmail
}