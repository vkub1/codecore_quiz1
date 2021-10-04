const express = require('express');
const knex = require('../db/client');
const router = express.Router();

function findHashtags(content) {
    let whitespace = /\B\#\w\w+\b/g
    tags = content.match(whitespace);
    return tags;
}

router.get('/', (req, res) => {
    let callbacks = [];
    callbacks.push(knex.select('*').from('clucks').orderBy('created_at', 'desc'));
    callbacks.push(knex.select('*').from('hashtags').orderBy('count', 'desc'));
    Promise.all(callbacks)
    .then(results => {
        res.render('index', {
            clucks: results[0],
            hashtags: results[1]
        })
    })
})

router.get('/new', (req, res) => {
    if (req.cookies.username) {
        res.render('new')
    } else {
        res.redirect('/signin')
    }
})

router.post('/', (req, res) => {
    console.log(req.body);
    let hashtags = findHashtags(req.body.content);
    let callbacks = [];
    //get hashtags

    if (hashtags) {
        //for each hashtag add a search callback for searching database for the tag 
        //if found return 0 else return count for that hashtag
        for (let hashtag of hashtags) {
            callbacks.push(
                knex('hashtags').whereRaw('tag LIKE ?', [hashtag]).first()
                .then( data => {
                    if (data) {
                        return data.count
                    } else {
                        return 0;
                    }
                })
            );
        }

        //For each returned count if it is 0 add to db
        //else update count + 1
        Promise.all(callbacks)
        .then(result => {
            let callbacks = [];
            for (let i = 0; i < result.length; i++) {
                if (result[i] === 0) {
                    const tag = {
                        tag: hashtags[i],
                        count: 1
                    }
                    callbacks.push(
                        knex('hashtags').insert(tag)
                    )
                } else {
                    const tag = {
                        tag: hashtags[i],
                        count: result[i] + 1
                    }
                    callbacks.push(
                        knex('hashtags').whereRaw('tag LIKE ?', [tag.tag]).update(
                            tag
                        )
                    );
                }
            }
            return Promise.all(callbacks);
        }).then(result => {
            console.log(result);
            const cluck = {
                username: req.cookies.username,
                content: req.body.content,
                image_url: req.body.image_url
            }
            knex('clucks').insert(cluck).then(
                res.redirect('/')
            )
        });
    } else {
        const cluck = {
            username: req.cookies.username,
            content: req.body.content,
            image_url: req.body.image_url
        }
        knex('clucks').insert(cluck).then(
            res.redirect('/')
        )
    }
    
})

module.exports = router;