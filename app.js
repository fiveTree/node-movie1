var express = require('express')

//express的中间件，旧版本express内置了此模块，新版express需要单独安装。
//此中间件用于格式化表单提交的数据
var bodyParser = require('body-parser')

//创建一个exress实例
var app = express()

//node内置的模块
var path = require('path')


//引入mongoose模块，来连接数据库
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoose = require('mongoose')
var MongoStore = require('connect-mongo')(session)


//引入字段替换模块
var _ = require('underscore')



//设置默认端口3000，并可以从命令行传端口号参数
var port = process.env.PORT || 3000

//连接本地的数据库，数据库名：imooc
const dbUrl = 'mongodb://localhost:27017/imooc'
mongoose.connect(dbUrl)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("imooc db is connected")
});
//设置页面试图入口文件夹
app.set('views', './app/views/pages')
//设置试图引擎模板
app.set('view engine', 'jade')
app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        url: dbUrl,
        collection:'sessions'
    })
}))

var logger = require('morgan');
// 配置
if ('development' === app.get('env')){
    app.set('showStackError',true)
    app.use(logger(':method:url:status'))
    // 网页源代码是否压缩
    app.locals.pretty = true
    mongoose.set('debug', true)
}

//格式化表单提交数据
app.use(bodyParser.urlencoded({ extended: true }))

//通过node内置的path模块，设置公共静态资源目录
app.use(express.static(path.join(__dirname + '/public')))

//监听端口
app.listen(port, () => {
    console.log('imooc start on port:' + port)
})
require('./config/routes')(app)
//日期和时间格式化插件，在list页面中格式化日期
app.locals.moment = require('moment');