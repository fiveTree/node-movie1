var Movie = require('../models/movie')
var Category = require('../models/category')
exports.index = (req, res) => {
    console.log('登录状态', req.session.user)
    // app.locals.user = req.session.user


    Category.find({})
        .populate({path:'movies',options:{
            limit:5
        }})
        .exec((err,categories)=>{
            if (err) {
                console.log('index' + err)
            }
            res.render('index', {
                title: '木木 mumu',
                categories
            })
        })
   /*  Movie.fetch((err, movies) => {
        if (err) {
            console.log('index' + err)
        }
        res.render('index', {
            title: '木木 mumu',
            movies
        })
    }) */

}

// search
exports.search = (req, res) => {
    console.log('登录状态', req.session.user)
    // app.locals.user = req.session.user

    var catId = req.query.cat
    var page = req.query.p
    var index = page*2

    Category.find({})
        .populate({
            path: 'movies', 
            select:'title poster',
            options: {
                limit: 6,
                skip:index
            }
        })
        .exec((err, categories) => {
            if (err) {
                console.log('index' + err)
            }
            res.render('index', {
                title: '木木 mumu',
                categories
            })
        })
    /*  Movie.fetch((err, movies) => {
         if (err) {
             console.log('index' + err)
         }
         res.render('index', {
             title: '木木 mumu',
             movies
         })
     }) */

}
