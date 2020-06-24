const express = require('express');
const router = express.Router();
const shortid = require('shortid');
var Algorithmia = require("algorithmia");

const Posts = require('../models/Posts');

router.post('/', async (req, res) => {
    const { code } = req.body;
    if (code !== '') {
        const id = shortid.generate();
        Algorithmia.client(process.env.CLIENT)
            .algo("PetiteProgrammer/ProgrammingLanguageIdentification/0.1.3")
            .pipe(code)
            .then(function (response) {
                Posts.create({
                    id: id,
                    code: code,
                    lang: response.get()[0][0] || 'Not Recognized',
                    user: req.cookies.username || 'Anonymous'
                }).then(() => res.redirect('/c/' + id));
            });
    }
});
module.exports = router;
