//加载Movie模型
var Comment = require('../models/comment')
//引入字段替换模块
var _ = require('underscore')

// comment
exports.save = (req, res) => {
    var {comment:_comment} = req.body
    console.log('保存评论')
    var movieId = _comment.movie
    if (_comment.cid){
        Comment.findById(_comment.cid,(err,comment)=>{
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }
            comment.reply.push(reply)
            comment.save((err, comment) => {
                console.log(3, err)
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movieId)
            })
        })
    }else{
        var comment = new Comment(_comment)

        comment.save((err, comment) => {
            console.log(3, err)
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movieId)
        })
    }
}
