//加载User模型
var User = require('../models/user')

// signup
exports.showSignup = (req, res) => {
    res.render('signup', {
        title: "注册页面",
    })
}
// signin
exports.showSignin = (req, res) => {
    res.render('signin', {
        title: "登录页面",
    })
}
// signup
exports.signup = (req, res) => {
    var _user = req.body.user
    // req.param('user)
    console.log(_user)
    User.findOne({ name: _user.name }, (err, user) => {
        if (err) {
            console.log(err)
        }
        if (user) {
            return res.redirect('/signin')
        } else {
            let user = new User(_user)
            user.save((err, user) => {
                if (err) {
                    console.log(err)
                }
                console.log(user)
                res.redirect('/')
            })
        }
    })

}
// signin
exports.signin = (req, res) => {
    let { user: _user } = req.body
    let { name, password } = _user
    User.findOne({ name }, (err, user) => {
        if (err) {
            console.log(err)
        }
        if (!user) {
            console.log('用户名不存在')
            return res.json({ success: -1, result: '', msg:'用户名不存在'})
            // return res.redirect('/signup')
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                console.log('登录成功')
                req.session.user = user
                return res.redirect('/')
            } else {
                console.log('密码错误')
                // return res.redirect('/signin')
                return res.json({ success: -1, result: '', msg: '密码错误' })
            }
        })
    })

}
// logout
exports.logout = (req, res) => {
    Reflect.deleteProperty(req.session, 'user')
    // Reflect.deleteProperty(app.locals, 'user')
    res.redirect('/')
}
// userList jada
exports.list = (req, res) => {
    User.fetch((err, users) => {
        if (err) {
            console.log(err)
        }

        res.render('userList', {
            title: "imooc 用户列表项",
            users
        })
    })

}

// userList jada
exports.signinRequired = (req, res, next) => {
    console.log(111)
    let {user} = req.session
    if (!user){
        return res.redirect('/signin')
    }
    next()
}
// userList jada
exports.adminRequired = (req, res, next) => {
    let { user } = req.session
    if (!user.role || user.role<=10) {
        return res.redirect('/signin')
    }
    next()
}