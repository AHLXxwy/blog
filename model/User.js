var mongoose=require('mongoose');
var userSchema=require('../schemals/user')
module.exports=mongoose.model("User",userSchema)
