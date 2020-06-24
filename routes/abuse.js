const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/:id', async (req, res) => {
    if (!req.params.id) return res.redirect('/');
    if (!req.cookies.username) return res.send('Please <a href="/auth">show</a> your identity before abusing anyone :)')
    request(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=400674061&text=Abuse+Reported by ${req.cookies.username}\nhttps://p.hackmate.tech/c/${req.params.id}`,
        () => res.end('The code was reported to the admin!')
    )
});
module.exports = router;
