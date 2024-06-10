const express = require('express')
const mongoose = require ('mongoose')
const nodemailer=require("nodemailer");
 let mailTransporter=nodemailer.createTransport({
    service:"gmail",auth:{user:"ayed.boukadida@esprit.tn",pass:"211JMT3065",}
}); 
var  random=Math.floor(Math.random() * 10000);
let details={
    from:"ayed.boukadida@esprit.tn",
    to:"ayedboukadida@gmail.com",
    subject:"Please reset your password",
    text:`We heard that you lost your application password.\n Sorry about that! But don’t worry!\n You can use the following CODE to reset your password : \n  ${random}`

};

    mailTransporter.sendMail(details,(err)=>{ if(err){ 
        
        console.log("it has an error",err) ;
    
    } else{ console.log("email has sent!") 
    
    
    
    }
     })