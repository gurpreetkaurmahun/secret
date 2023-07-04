require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

console.log(process.env.SECRET);

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine" ,"ejs");

mongoose.connect('mongodb://localhost:27017/userDB', {
    family:4
})
    .then(() => {
        console.log('FINE');
    })
    .catch(() => {
        console.log("BAD");
    })
    
const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
 var secret=process.env.SECRET;
 userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });

const User= mongoose.model("User",userSchema);

app.get("/",function(request,response){
    response.render("home");
});

app.get("/login",function(request,response){
    response.render("login");
});

app.get("/register",function(request,response){
    response.render("register");
});


app.post("/register",function(request,response){
    const newUser=new User({
        email:request.body.username,
        password:request.body.password
    });

    newUser.save();
    response.render("secrets");

})


app.post("/login" ,function(request,response){
    const username=request.body.username;
    const password=request.body.password;

    User.findOne({email:username}).then(function(result){
        if(result){
            if(result.password===password){
                console.log("Match Found");
                response.render("secrets");
            }
        }else{
            console.log("Match Not Found");
        }
    }).catch(function(err){
        console.log(err);
    });
})

















app.listen(3000,function(request,response){
    console.log("Server started at port 3000");
})
