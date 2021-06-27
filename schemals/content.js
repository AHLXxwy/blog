var mongoose=require("mongoose");
var Schema=mongoose.Schema;
//分类的表结构
module.exports=new Schema({
    //关联字段
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //内容标题
    title:String,
    //关联字段-用户id
    user:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //添加时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        defalut:''
    },
    //内容
    content:{
        type:String,
        defalut:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }

})

