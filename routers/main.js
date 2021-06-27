var express = require('express');
var Category = require('../model/Category')
var Content = require('../model/Content')
const router = express.Router();
var data
//处理通用数据
router.use(function(req,res,next){
    data={
        userInfo:req.userInfo,
        categories:[],
    }
    Category.find().then(function(categories){
        data.categories=categories;
        next();
    })
})
 
/* GET home page. */
router.get('/', function (req, res) {
    data.category=req.query.category||'';
    data.count=0;
    data.page= Number(req.query.page || 1)
    data.limit=4
    data.pages=0
    var where={};
    if(data.category){
        where.category=data.category
    }
    Content.where(where).count().then(function(count){
        data.count=count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过总页数且为正数
        data.page = Math.min(data.page, data.pages)
        data.page = Math.max(data.page, 1)
        var skip = (data.page - 1) * data.limit
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        })
    }).then(function(contents){
        data.contents=contents;
        res.render('main/index.html',data);
    });
});
 
router.get('/view',function(req,res){
    var contentId=req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then(function(content){
        data.content=content;
        content.views++;
        content.save()
        res.render('main/view',data)
    })
})


module.exports = router;
