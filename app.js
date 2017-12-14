var express = require('express')

//express的中间件，旧版本express内置了此模块，新版express需要单独安装。
//此中间件用于格式化表单提交的数据
var bodyParser = require('body-parser')

//创建一个exress实例
var app = express()

//node内置的模块
var path = require('path')
//日期和时间格式化插件，在list页面中格式化日期
app.locals.moment = require('moment');

//引入mongoose模块，来连接数据库
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')

//引入字段替换模块
var _ = require('underscore')

//加载Movie模型
var Movie = require('./models/movie')
//加载User模型
var User = require('./models/user')


//设置默认端口3000，并可以从命令行传端口号参数
var port = process.env.PORT || 3000

//连接本地的数据库，数据库名：imooc
mongoose.connect('mongodb://localhost:27017/imooc')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("imooc db is connected")
});

//设置页面试图入口文件夹
app.set('views', './views/pages')
//设置试图引擎模板
app.set('view engine', 'jade')

var cookieParser = require('cookie-parser')
var session = require('express-session')
app.use(cookieParser())
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true
}))


//格式化表单提交数据
app.use(bodyParser.urlencoded({ extended: true }))

//通过node内置的path模块，设置公共静态资源目录
app.use(express.static(path.join(__dirname + '/public')))

//监听端口
app.listen(port, () => {
    console.log('imooc start on port:' + port)
})
// index jada
app.get('/',(req,res)=>{
    console.log('登录状态',req.session.user)
    Movie.fetch((err,movies)=>{
        if(err){
            console.log('index'+err)
        }

        res.render('index', {
            title: '木木 mumu',
            movies
        })
    })
    
})
// signup
app.post('/user/signup', (req, res) => {
    var _user = req.body.user
    // req.param('user)
    console.log(_user)
    User.findOne({ name: _user.name},(err,user)=>{
        if (err) {
            console.log(err)
        }
        if(user){
            return res.redirect('/')
        }else{
            let user = new User(_user)
            user.save((err, user) => {
                if (err) {
                    console.log(err)
                }
                console.log(user)
                res.redirect('/admin/userList')
            })
        }
    })
    
})
app.post('/user/signin',(req,res)=>{
    let {user:_user} = req.body
    let {name,password} = _user
    User.findOne({ name}, (err, user) => {
        if (err) {
            console.log(err)
        }
        if (!user) {
            console.log('用户名不存在')
            return res.redirect('/')
        } 
        user.comparePassword(password,(err,isMatch)=>{
            if (err) {
                console.log(err)
            }
            if (isMatch){
                console.log('登录成功')
                req.session.user = user
                return res.redirect('/') 
            }else{
                console.log('密码错误')
                return 
            }
        })
    })

})
// userList jada
app.get('/admin/userList', (req, res) => {
    User.fetch((err, users) => {
        if (err) {
            console.log(err)
        }

        res.render('userList', {
            title: "imooc 用户列表项",
            users
        })
    })

})


// detail jada
app.get('/movie/:id', (req, res) => {
    let id = req.params.id
    Movie.findById(id,(err,movie)=>{
        res.render('detail', {
            title: " imooc"+movie.title,
            movie
        })
    })
    
})

// admin jada
app.get('/admin/new', (req, res) => {
    res.render('admin', {
        title: "公司 后台录入页",
        movie: {
            doctor: "",
            country: '',
            title: "",
            year: '',
            poster: "",
            language: "",
            flash: "",
            summary: ''
        }
    })
})


// admin update movie
app.get('/admin/update/:id', (req, res) => {
    let id = req.params.id
    console.log('id='+id)
    if (id) {
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.log(err)
            }
            console.log('movie=' + movie)
            res.render('admin',{
                title: "公司 后台更新页",
                movie:movie
            })
        })
    } 
})

// admin post movie
app.post('/admin/movie/new', (req, res) => {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    console.log('开始')
    var _movie
    if (id !== 'undefined' ){
        console.log("0 ：id !== 'undefined'")
        Movie.findById(id,(err,movie)=>{
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie,movieObj)
            _movie.save((err,movie)=>{
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/'+movie._id)
            })
        })
    }else{
        console.log("1：id == 'undefined'")
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year,
        })
        console.log(2,movieObj)
        _movie.save((err, movie) => {
            console.log(3,err)
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
    
})



// list jada
app.get('/admin/list', (req, res) => {
    Movie.fetch((err, movies) => {
        if (err) {
            console.log(err)
        }

       res.render('list', {
           title: "imooc 列表项",
           movies
       })
    })
    
})
// list delete
app.delete('/admin/list',(req,res)=>{
    var id = req.query.id
    if(id){
        Movie.remove({_id:id},(err,movie)=>{
            if (err) {
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
})