const express = require('express');
const app = express();
const clucksRouter = require('./routes/clucks');

const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(logger('dev'));
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req,res, next) => {
    const username = req.cookies.username || '';
    res.locals.username = username;
    next();
})

app.get('/', (req, res) => {
   res.redirect('/clucks')
})

app.get('/signin', (req, res) => {
    let username = req.cookies.username || "";
    res.render('sign-in', {
        username: username
    })
})

app.post('/signin', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  res.redirect('/');
})

app.post('/sign_out', (req, res) => {
    res.clearCookie('username');
    res.redirect('/signin');
})


app.use('/clucks', clucksRouter);
const PORT = 3000;
const DOMAIN = 'localhost';
app.listen(PORT, DOMAIN, function () {
    console.log(`The server is running at http://${DOMAIN}:${PORT}`);
});