var express = require('express');
var router = express.Router();
var User=require('../model/User')
var Content=require('../model/Content')
// var Room=require('../model/Room').Room
// var Odering=require('../model/Ordering').Odering;
//定义统一返回变量格式
var responseData; 
router.use(function(req,res,next){
	responseData = {
		code:0,//0代表无错误信息	
		message:''//代表错误信息			
	}
	next();
})

//用户注册
/*注册逻辑
1.用户名不能为空
2.密码不能为空
3.两次输入必须一致

1.用户是否已经被注册
数据库查询
*/
router.post('/user/register',function(req,res,next){
	console.log(req.body)
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;
	//用户名不能空
	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		console.log(responseData)
		res.json(responseData); //使用res.json的方法返回前端数据
		return;
	}
	//密码不能为空
	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		console.log(responseData)
		res.json(responseData);
		return;
	}
	//两次输入的密码不能不一样
	if(password != repassword){
		responseData.code = 3;
		responseData.message = '两次输入的密码不一致';
		console.log(responseData)
		res.json(responseData);
		return;
	}
	//验证用户名是否已经注册，需要通过模型类查询数据库
	User.findOne({
		username:username
	}).then(function(userInfo ){
		console.log(userInfo); //若控制台返回空表示没有查到数据
		if(userInfo){
			//若数据库有该记录
			responseData.code = 4;
			responseData.message = '用户名已被注册';
			res.json(responseData);
			return;
		}
		else{
		//用户名没有被注册则将用户保存在数据库中
		var user = new User({
			username:username,
			password:password
		});//通过操作对象操作数据库
		user.save();
		return;
	}
	}).then(function(newUserInfo){
		responseData.code='0'
		responseData.message = '注册成功';
		console.log(responseData)
		res.json(responseData);
	});
 
})
//登录
router.post('/user/login',function(req,res){
	console.log(req);
	var username=req.body.username
	var password=req.body.password
	
	if(username==''||password==''){
		responseData.code=1;
		responseData.message='用户名和密码不能为空'
		res.json(responseData)
		return;
	}
	//查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if(!userInfo){
			responseData.code=2;
			responseData.message='用户名或密码错误'
			console.log(responseData)
			console.log(username);
			console.log(password);
		    res.json(responseData)
			return;
		}
		//用户名和密码是正确的
		responseData.code='0'
		responseData.message='登录成功';
		console.log(responseData)
		responseData.userInfo={
			_id:userInfo._id,
			username:userInfo.username
		}
		req.cookies.set('userInfo',JSON.stringify({
			_id:userInfo._id,
			username:userInfo.username
		}));
		res.json(responseData);
		return;
	})

})
//退出
router.get('/user/logout',function(req,res){
	req.cookies.set('userInfo',null);
	responseData.message='退出'
	res.json(responseData)
})
//获取指定文章的所有评论
router.get('/comment',function(req,res){
	var contentId=req.query.contentid||'';
	Content.findOne({
		_id:contentId
	}).then(function(content){
		responseData.data=content.comments;
		res.json(responseData)
	})
})
//评论提交
router.post('/comment/post',function(req,res){
	//内容的id
	var contentId=req.body.contentid||''
	var postData={
		username:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content
	}
	//查询当前这篇内容的信息
	Content.findOne({
		_id:contentId
	}).then(function(content){
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent){
		responseData.message='评论成功'
		responseData.data=newContent
		console.log(responseData)
		res.json(responseData)
	})
})
module.exports = router;

