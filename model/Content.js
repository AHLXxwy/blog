var mongoose=require('mongoose');
var contentSchema=require('../schemals/content')
module.exports=mongoose.model("Content",contentSchema)
