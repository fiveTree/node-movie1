var Movie = require('../models/movie')
exports.index = (req, res) => {
    console.log('登录状态', req.session.user)
    // app.locals.user = req.session.user
    Movie.fetch((err, movies) => {
        if (err) {
            console.log('index' + err)
        }
        res.render('index', {
            title: '木木 mumu',
            movies
        })
    })

}
