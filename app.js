//加载express模块
const express = require('express')
//加载模板处理模块
var swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//前端发送的数据请求需要后端获取，express的中间件模块body-parser可用于获取前端Post提交的数据
var bodyParser = require('body-parser');//加载body-parser处理post提交的数据
//加载cookies模块
var Cookies = require('cookies');
const app = express()
var User=require('./model/User');
//配置应用模板
//定义当前应用所使用的模板引擎
app.engine('html',swig.renderFile);
//设置模板文件存放的目录
app.set('views', __dirname + '/views');
//注册所使用的模板
app.set('view engine', 'html');//模板
//第一次读取会把模板缓存到内存当中，下次会直接读取，因此即使改了模板内容刷新也不会有变化，需要在开发过程中需要取消模板缓存
swig.setDefaults({cache:false});
//bodypars设置
app.use(bodyParser.urlencoded({extended:true}))
//设置cookie
app.use(function(req,res,next){
		req.cookies=new Cookies(req,res);
		console.log(req.cookies.get('userInfo'));
		//解析登录用户的cookie信息
		req.userInfo={};
		if(req.cookies.get('userInfo')){
			try{
			req.userInfo=JSON.parse(req.cookies.get('userInfo'))
			//获取当前登录用户的类型
			User.findById(req.userInfo._id).then(function(userInfo){
				req.userInfo.isAdmin=Boolean(userInfo.isAdmin)
				next();
			})
			}catch(e){
				next()
			}
		}else{
			next();
		}
		
		
		
})
//可以通过前缀地址来访问 public 目录中的文件
app.use(express.static(__dirname + '/public'));

//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));
// app.use((err, req, res, next) => {
// 	console.error(err.stack);
// 	res.status(500).send('出错了！');
//   });
mongoose.connect('mongodb://localhost:27017/blog',function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(3000); //监听http请求
	}
});




