var mongoose=require('mongoose');
var categorySchema=require('../schemals/category')
module.exports=mongoose.model("Category",categorySchema)
