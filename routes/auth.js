const express = require('express');
const request = require('request');
const router = express.Router();

const Users = require('../models/Users');

let githubOAuth = require('github-oauth')({
    githubClient: '00f44571b40a51de0e6d',
    githubSecret: process.env.SECRET,
    baseURL: 'https://p.hackmate.tech',
    loginURI: '/auth',
    callbackURI: '/auth/github/callback',
    scope: 'user' // optional, default scope is set to user
});

router.get('/', async (req, res) => githubOAuth.login(req, res));
router.get('/github/callback', async (req, res) => githubOAuth.callback(req, res));

githubOAuth.on('error', function (err) {
    console.error('there was a login error', err)
});

githubOAuth.on('token', function (token, serverResponse) {
    try {
        const { access_token } = token;
        request({
            url: 'https://api.github.com/user?access_token=' + access_token,
            headers: {
                'User-Agent': 'Awesome-Octocat-App'
            }
        }, (err, res, body) => {
            try {
                const { login } = JSON.parse(body);
                if (login) {
                    Users.create({
                        username: login,
                        isAuth: true
                    }).then(user => {
                        console.log('created');
                        serverResponse.cookie('username', login);
                        serverResponse.cookie('_uid', user._id);
                        serverResponse.redirect('/');
                    }).catch(() => {
                        Users.findOne({ username: login }).then(user => {
                            serverResponse.cookie('username', login);
                            serverResponse.cookie('_uid', user._id);
                            serverResponse.redirect('/');
                        });
                    });
                } else {
                    serverResponse.send('There was an error while logging you in. <a href="/">Click here to continue</a>');
                }
            } catch (e) {
                console.log(e);
            }
        })
    } catch (e) {
        console.log(e)
        serverResponse.end('something went wrong');
    }
});

module.exports = router;
