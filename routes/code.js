const express = require('express');
const router = express.Router();
const Posts = require('../models/Posts');
router.get('/c/:id', async (req, res) => {
    let id = req.params.id;
    Posts.findOne({ id: id }).then(post => {
        if (post) {
            let { code, views, lang } = post;
            post.views++;
            post.save(() => {
                res.render('index', { title: `Code by ${post.user}`, desc: code.substring(0, 100), username: post.user, value: code, views: views, id: id, isLogged: req.isLogged, lang: lang });
            })
        } else {
            res.redirect('/');
        }
    });
});

router.get('/raw/:id', async (req, res) => {
    let id = req.params.id;
    Posts.findOne({ id: id }).then(post => {
        if (post) {
            let { code } = post;
            post.save(() => {
                res.end(code);
            })
        } else {
            res.redirect('/');
        }
    });
});


module.exports = router;
