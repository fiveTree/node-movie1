//加载Movie模型
var Movie = require('../models/movie')
var Comment = require('../models/comment')
//引入字段替换模块
var _ = require('underscore')

// detail jada
exports.detail = (req, res) => {
    let id = req.params.id
    if(!id){
        console.log(req);
    }
    Movie.findById(id, (err, movie) => {
        if (err) {
            console.log(err)
        }
        Comment
        .find({movie:id})
        .populate('from','name')
        .populate('reply.from reply.to','name')
        .exec((err,comments)=>{
            console.log('comments', comments);
            res.render('detail', {
                title: " imooc" + movie.title,
                movie,
                comments
            })
        })
        
    })
}
// admin new jada
exports.new = (req, res) => {
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
            summary: '',
        }
    })
}


// admin update movie
exports.update = (req, res) => {
    let id = req.params.id
    console.log('id=' + id)
    if (id) {
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.log(err)
            }
            console.log('movie=' + movie)
            res.render('admin', {
                title: "公司 后台更新页",
                movie: movie
            })
        })
    }
}

// admin post movie
exports.save =  (req, res) => {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    console.log('开始')
    var _movie
    if (id !== 'undefined') {
        console.log("0 ：id !== 'undefined'")
        Movie.findById(id, (err, movie) => {
            if (err) {
                console.log(err)
            }

            _movie = _.extend(movie, movieObj)
            _movie.save((err, movie) => {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
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
        console.log(2, movieObj)
        _movie.save((err, movie) => {
            console.log(3, err)
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }

}



// list jada
exports.list =   (req, res) => {
    Movie.fetch((err, movies) => {
        if (err) {
            console.log(err)
        }

        res.render('list', {
            title: "imooc 列表项",
            movies
        })
    })

}
// list delete
exports.del =  (req, res) => {
    var id = req.query.id
    if (id) {
        Movie.remove({ _id: id }, (err, movie) => {
            if (err) {
                console.log(err)
            }
            else {
                res.json({ success: 1 })
            }
        })
    }
}