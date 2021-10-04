const express = require('express');
const knex = require('../db/client');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.cookies.username) {
        res.render('index')
    } else {
        res.redirect('/signin')
    }
})

router.get('/new', (req, res) => {
    if (req.cookies.username) {
        res.render('new')
    } else {
        res.redirect('/signin')
    }
})

router.post('/', (req, res) => {
    console.log(req.body)
    const cluck = {
        username: req.cookies.username,
        content: req.body.content,
        image_url: req.body.image_url
    }
    knex('clucks').insert(cluck).then(
        res.redirect('/')
    )
})



module.exports = router;