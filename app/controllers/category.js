//加载Movie模型
var Category = require('../models/category')

// admin new jada
exports.new = (req, res) => {
    res.render('categoryAdmin', {
        title: "公司 后台分类录入页",
        category:{}
    })
}

// admin post Category
exports.save = (req, res) => {
    console.log(req)
    var { category} = req.body
    var category = new Category(category)
    category.save((err, category) => {
        console.log(3, err)
        if (err) {
            console.log(err)
        }
        res.redirect('/admin/category/list')
    })

}
// list jada
exports.list = (req, res) => {
    Category.fetch((err, categories) => {
        if (err) {
            console.log(err)
        }

        res.render('categoryList', {
            title: "imooc 列表项",
            categories
        })
    })

}